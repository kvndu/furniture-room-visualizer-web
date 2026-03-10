import { useContext } from "react";
import { DesignContext } from "../context/DesignContext";

export function useDesign() {
  return useContext(DesignContext);
}