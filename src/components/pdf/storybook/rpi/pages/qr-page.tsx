import { Image, Text, Page, StyleSheet } from "@react-pdf/renderer";
import { pageSize, globalStyles } from "../index";

const styles = StyleSheet.create({
  image: {
    height: 300,
  },
  qrSection: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 100
  },
  qrImage: {
    height: 115,
  },
  qrText: {
    fontSize: 16,
    lineHeight: 1.3
  },
});

const QRPagePDF = () => (
  <Page size={pageSize} style={globalStyles.page}>
      <Image
        style={styles.image}
        src="/pdf/kiwi-reading.png"
      />
      <div style={styles.qrSection}>
        <Image
          style={styles.qrImage}
          src="/pdf/qr-example-do-not-use-in-production.png"
        />
        <div style={{ marginLeft: 20 }}>
          <Text style={styles.qrText}>
            Scan this QR code
          </Text>
          <Text style={styles.qrText}>
            to order another copy!
          </Text>
        </div>
      </div>
  </Page>
)

export default QRPagePDF
