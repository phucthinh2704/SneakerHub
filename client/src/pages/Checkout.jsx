import { useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { apiCreateOrder } from "../api/order";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cartData = location.state?.cartData;

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    paymentMethod: "COD"
  });

  if (!cartData) {
    navigate("/cart");
    return null;
  }

  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Chuẩn bị payload khớp với Order Model
    const orderPayload = {
      orderItems: cartData.cartItems.map(item => ({
        product: item.product,
        name: item.name,
        qty: item.quantity,
        image: item.image,
        price: item.price,
        selectedColor: item.color,
        selectedSize: item.size
      })),
      shippingAddress: {
        fullName: form.fullName,
        phone: form.phone,
        address: form.address
      },
      paymentMethod: form.paymentMethod,
      itemsPrice: cartData.totalPrice,
      shippingPrice: 0,
      totalPrice: cartData.totalPrice
    };

    try {
      const res = await apiCreateOrder(orderPayload);
      if (res.success) {
        toast.success("Đặt hàng thành công!");
        navigate("/my-orders"); // Chuyển đến trang lịch sử đơn hàng
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi đặt hàng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Thanh toán đơn hàng</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Thông tin giao hàng */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg">Thông tin giao hàng</h3>
          <input required name="fullName" placeholder="Họ tên người nhận" onChange={handleChange} className="w-full p-3 border rounded"/>
          <input required name="phone" placeholder="Số điện thoại" onChange={handleChange} className="w-full p-3 border rounded"/>
          <textarea required name="address" placeholder="Địa chỉ chi tiết (Số nhà, Phường, Quận...)" onChange={handleChange} rows="3" className="w-full p-3 border rounded"></textarea>
          
          <h3 className="font-bold text-lg mt-4">Phương thức thanh toán</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
              <input type="radio" name="paymentMethod" value="COD" checked={form.paymentMethod === 'COD'} onChange={handleChange} />
              <span>Thanh toán khi nhận hàng (COD)</span>
            </label>
            <label className="flex items-center space-x-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
              <input type="radio" name="paymentMethod" value="Banking" checked={form.paymentMethod === 'Banking'} onChange={handleChange} />
              <span>Chuyển khoản ngân hàng</span>
            </label>
          </div>
        </div>

        {/* Review đơn hàng */}
        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h3 className="font-bold text-lg mb-4">Đơn hàng của bạn</h3>
          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
             {cartData.cartItems.map(item => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span>{item.name} (x{item.quantity})</span>
                  <span className="font-medium">{new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)} đ</span>
                </div>
             ))}
          </div>
          <div className="border-t pt-4 flex justify-between font-bold text-xl text-orange-600">
             <span>Tổng thanh toán</span>
             <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cartData.totalPrice)}</span>
          </div>

          <button disabled={loading} type="submit" className="w-full mt-6 bg-gray-900 text-white py-3 rounded font-bold hover:bg-gray-800 transition">
            {loading ? "Đang xử lý..." : "XÁC NHẬN ĐẶT HÀNG"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;