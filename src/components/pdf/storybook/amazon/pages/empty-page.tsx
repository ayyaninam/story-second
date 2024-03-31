import { Page } from "@react-pdf/renderer";
import { pageSize } from "../index";

const EmptyPagePDF = () => (
  <Page size={pageSize} />
)

export default EmptyPagePDF
