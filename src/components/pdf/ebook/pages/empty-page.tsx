import { Page } from "@react-pdf/renderer";
import { globalStyles, pageSize } from "../index";

const EmptyPagePDF = () => (
  <Page style={globalStyles.page} size={pageSize} />
)

export default EmptyPagePDF
