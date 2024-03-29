import { useEffect } from "react";
import { useTenantContext } from "src/contexts/tenant-context";
import { useSchoolContext } from "src/contexts/school-context";
import CircularLoaderWithImage from "./components/loader";
import apiCalls from "src/api";
import { Box } from "@mui/material";

const PrivatePagesContainer = ({ children }) => {
  const { setTenantConfig } = useTenantContext();
  const { setGradesSectionsList, showGloablLoader } =
    useSchoolContext();
    setGradesSectionsList("9")

  const getThisTenantInfo = async () => {
    const resData = await apiCalls.thisTenant();
    if (resData) {
      setTenantConfig(resData);
    }
  };

  useEffect(() => {
    getThisTenantInfo();
  }, []);

  return (
    <>
      <CircularLoaderWithImage show={showGloablLoader} />
      {children}
      <Box sx={{ pb: { md: 0, xs: 5 } }}></Box>
    </>
  );
};

export default PrivatePagesContainer;
