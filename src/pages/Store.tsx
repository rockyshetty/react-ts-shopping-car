import { Container, Row, Col } from "react-bootstrap";
import storeItems from "../data/items.json";
import { StoreItem } from "../components/StoreItem";

export default function Store() {
  return (
    <Container>
      <h1>Store</h1>
      <Row>
        {storeItems.map((item) => (
          <Col key={item.id}>
            <StoreItem {...item} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
