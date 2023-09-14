import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { withSwal } from "react-sweetalert2";

function SettingsPage({ swal }) {
  const [products, setProducts] = useState([]);
  const [featuredProductId, setFeaturedProductId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [shippingFee, setShippingFee] = useState("");
  const [productsLoading, setProductsLoading] = useState(false);
  const [featuredLoading, setFeaturedLoading] = useState(false);

  useEffect(() => {
    setProductsLoading(true);
    axios.get("/api/products").then((res) => {
      setProducts(res.data);
      setProductsLoading(false);
    });
    setFeaturedLoading(true);
    axios.get("/api/settings?name=featuredProductId").then((res) => {
      setFeaturedProductId(res.data.value);
      setFeaturedLoading(false);
    });
    fetchAll().then(() => {
      setIsLoading(false);
    });
  }, []);

  async function fetchAll() {
    await axios.get("/api/products").then((res) => {
      setProducts(res.data);
    });
    await axios.get("/api/settings?name=featuredProductId").then((res) => {
      setFeaturedProductId(res.data.value);
    });
    // await axios.get("/api/settings?name=shippingFee").then((res) => {
    //   setShippingFee(res.data.value);
    // });
  }

  async function saveSettings() {
    setIsLoading(true);
    await axios
      .put("/api/settings", {
        name: "featuredProductId",
        value: featuredProductId,
      })
      .then(() => {
        swal.fire({
          title: "Settings saved!",
          icon: "success",
        });
      });
    // await axios.put("/api/settings", {
    //   name: "shippingFee",
    //   value: shippingFee,
    // });
    setIsLoading(false);
    await swal.fire({
      title: "Settings saved!",
      icon: "success",
    });
  }

  return (
    <Layout>
      <h1>Settings</h1>
      {(productsLoading || featuredLoading) && <Spinner />}
      {!productsLoading && !featuredLoading && (
        <>
          <label>Featured product</label>
          <select
            value={featuredProductId}
            onChange={(ev) => setFeaturedProductId(ev.target.value)}
          >
            {products.length > 0 &&
              products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.title}
                </option>
              ))}
          </select>
          {/* <label>Shipping price (in gbp)</label> */}
          {/* <input
            type="number"
            value={shippingFee}
            onChange={(ev) => setShippingFee(ev.target.value)}
          /> */}
          <div>
            <button onClick={saveSettings} className="btn-primary">
              Save settings
            </button>
          </div>
        </>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }) => <SettingsPage swal={swal} />);
