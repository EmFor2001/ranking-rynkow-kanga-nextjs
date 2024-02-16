"use client";

import { Dialog, DialogContent, DialogTitle } from "@mui/material";

import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

const DialogWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const StyledDialogTitle = styled(DialogTitle)`
  text-align: center;
`;

const StyledDialogContent = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  padding: 20px;
`;

const DepthDialog = ({ open, handleClose, modalData }) => {
  const [depth, setDepth] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (modalData.name) {
      const params = new URLSearchParams({ name: modalData.name });
      fetch("/api?" + params.toString())
        .then((res) => res.json())
        .then((data) => {
          setDepth(data);
          setIsLoading(false);
        });
    }
  }, [modalData.name]);

  const {
    asksDepth,
    asksMaxPrice,
    asksMinPrice,
    bidsDepth,
    bidsMaxPrice,
    bidsMinPrice,
  } = useMemo(() => {
    if (
      depth?.asks &&
      depth.asks.length > 0 &&
      depth?.bids &&
      depth.bids.length > 0 &&
      !isLoading
    ) {
      return {
        asksDepth: depth.asks.reduce(
          (acc, curr) => acc + parseFloat(curr.quantity),
          0
        ),
        asksMaxPrice: depth.asks.reduce(
          (acc, curr) => Math.max(acc, parseFloat(curr.price)),
          parseFloat(depth.asks[0].price)
        ),
        asksMinPrice: depth.asks.reduce(
          (acc, curr) => Math.min(acc, parseFloat(curr.price)),
          parseFloat(depth.asks[0].price)
        ),
        bidsDepth: depth.bids.reduce(
          (acc, curr) => acc + parseFloat(curr.quantity),
          0
        ),
        bidsMaxPrice: depth.bids.reduce(
          (acc, curr) => Math.max(acc, parseFloat(curr.price)),
          parseFloat(depth.bids[0].price)
        ),
        bidsMinPrice: depth.bids.reduce(
          (acc, curr) => Math.min(acc, parseFloat(curr.price)),
          parseFloat(depth.bids[0].price)
        ),
      };
    } else {
      return {
        asksDepth: 0,
        asksMaxPrice: 0,
        asksMinPrice: 0,
        bidsDepth: 0,
        bidsMaxPrice: 0,
        bidsMinPrice: 0,
      };
    }
  }, [depth, isLoading]);

  return (
    <DialogWrapper>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth={"xs"}>
        <StyledDialogTitle>{modalData.name}</StyledDialogTitle>
        <StyledDialogContent>
          <h3>Asks depth</h3>
          <p>{asksDepth ? asksDepth : "Brak Danych"}</p>
          <h3>Bids depth</h3>
          <p>{bidsDepth ? bidsDepth : "Brak Danych"}</p>
          <h3>Asks max price</h3>
          <p>
            {asksMaxPrice
              ? asksMaxPrice < 0.000001
                ? asksMaxPrice.toFixed(8)
                : asksMaxPrice
              : "Brak Danych"}
          </p>
          <h3>Asks min price</h3>
          <p>
            {asksMinPrice
              ? asksMinPrice < 0.000001
                ? asksMinPrice.toFixed(8)
                : asksMinPrice
              : "Brak Danych"}
          </p>
          <h3>Bids max price</h3>
          <p>
            {bidsMaxPrice
              ? bidsMaxPrice < 0.000001
                ? bidsMaxPrice.toFixed(8)
                : bidsMaxPrice
              : "Brak Danych"}
          </p>
          <h3>Bids min price</h3>
          <p>
            {bidsMinPrice
              ? bidsMinPrice < 0.000001
                ? bidsMinPrice.toFixed(8)
                : bidsMinPrice
              : "Brak Danych"}
          </p>
        </StyledDialogContent>
      </Dialog>
    </DialogWrapper>
  );
};

export default DepthDialog;
