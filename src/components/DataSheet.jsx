"use client";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import DepthDialog from "./DepthDialog";
import { TextField, ThemeProvider } from "@mui/material";
import styled from "styled-components";
import { theme, textFieldTheme } from "../helpers/themes";

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-inline: 20px;
  
  @media (min-width: 610px) {
    align-items: center;
    padding-bottom: 20px;
  }
`;

const PageTitle = styled.h1`
  text-align: left;
  margin-bottom: 20px;
  color: ${theme.palette.primary};

  @media (min-width: 610px) {
    text-align: center;
  }
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 20px;
  width: 200px;

  @media (min-width: 610px) {
    width: 610px;
  }
`;

const StyledDatagrid = styled(DataGrid)`
  border: 1px solid #e65321;
`;

const DatagridWrapper = styled.div`
  height: 80vh;
  width: 610px;
  overflow-x: auto;
`;

const DataSheet = ({ pairs, summary }) => {
  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [filterValue, setFilterValue] = useState("");

  const filterModel = {
    items: [{ field: "name", operator: "contains", value: filterValue }],
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRowClick = (params) => {
    setModalData(params.row);
    setOpen(true);
  };

  const countSpread = (bid, ask) => {
    const A = parseFloat(ask);
    const B = parseFloat(bid);
    return ((A - B) / (0.5 * (A + B))) * 100;
  };

  const columns = [
    {
      field: "name",
      headerName: "Nazwa rynku",
      width: 150,
    },
    {
      field: "highestBid",
      headerName: "Highest Bid",
      width: 110,
      sortable: false,
    },
    {
      field: "lowestAsk",
      width: 110,
      sortable: false,
    },
    {
      field: "spread",
      headerName: "Spread [%]",
      width: 150,

      renderCell: (params) => {
        const spread = Math.round(params.value * 1000) / 1000;
        return isNaN(spread) ? 0 + "%" : spread + "%";
      },
    },
    {
      field: "rag",
      headerName: "RAG",
      width: 80,
      renderCell: (params) => (
        <div
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            backgroundColor:
              parseFloat(params.row.spread) <= 2 &&
              parseFloat(params.row.spread) > 0
                ? "green"
                : parseFloat(params.row.spread) > 2
                ? "gold"
                : "red",
          }}
        ></div>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  const combinedData = pairs.map((pair) => {
    const matchingSummary = summary.find(
      (item) => item.trading_pairs === pair.base + "-" + pair.target
    );
    return { ...pair, ...matchingSummary };
  });

  const rows =
    combinedData.length !== 0 &&
    combinedData.map((element, index) => ({
      id: index,
      name: element.base + "-" + element.target,
      highestBid: element.highest_bid ? element.highest_bid : "-",
      lowestAsk: element.lowest_ask ? element.lowest_ask : "-",
      spread: isNaN(countSpread(element.highest_bid, element.lowest_ask))
        ? "0"
        : countSpread(element.highest_bid, element.lowest_ask),
    }));

  return (
    <>
      <PageWrapper>
        <PageTitle>Ranking Rynków</PageTitle>

        <ThemeProvider theme={textFieldTheme}>
          <StyledTextField
            id="search"
            label="Szukaj rynku"
            variant="outlined"
            onChange={(e) => {
              setFilterValue(e.target.value);
            }}
            color="primary"
          />
        </ThemeProvider>
        <DatagridWrapper>
          <StyledDatagrid
            rows={rows}
            columns={columns}
            onRowDoubleClick={handleRowClick}
            filterModel={filterModel}
            // sx={{ border: "1px solid #E65321" }}
            initialState={{
              pagination: { paginationModel: { pageSize: 25, page: 0 } },
            }}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0
                ? "Mui-even"
                : "Mui-odd"
            }
          />
        </DatagridWrapper>
        <DepthDialog
          open={open}
          handleClose={handleClose}
          modalData={modalData}
        />
      </PageWrapper>
    </>
  );
};

export default DataSheet;
