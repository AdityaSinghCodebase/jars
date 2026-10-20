import { useContext } from "react";
import { AppDataContext } from "../context/AppDataContext";

function useAppData() {
  return useContext(AppDataContext);
}

export default useAppData;
