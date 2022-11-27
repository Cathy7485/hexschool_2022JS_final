//DOM
const productWrap = document.querySelector(".productWrap");
const productSelect = document.querySelector(".productSelect");
const cartList = document.querySelector(".shoppingCart-table tbody");


// 初始化資料
function init(){
  getProductList();
  getCartList();
}
init();

// 取得產品列表
let productList = [];
function getProductList() {
  const URL = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`;
  axios.get(URL)
    .then(function (response) {
      productList = response.data.products;
      renderProductList();
    })
    .catch(function(error){
      console.log(error);
    })
}

//渲染產品資料
function renderProductList(){
  let str = "";
  productList.forEach(item=>{
    str += comprise(item);
  })
  productWrap.innerHTML = str;
}

//重組產品字串函式 comprise
function comprise(item){
  let string = `
        <li class="productCard">
        <h4 class="productType">新品</h4>
        <img src="${item.images}" alt="">
        <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
        <h3>${item.title}</h3>
        <del class="originPrice">NT$${item.origin_price}</del>
        <p class="nowPrice">NT$${item.price}</p>
      </li>
    `
    return string;
}

//產品下拉選單監聽
productSelect.addEventListener("change",function(e){
  const category = e.target.value;
  if(category === "全部"){
    renderProductList();
    return;
  }
  let str = "";
  productList.forEach(item=>{
    if(item.category === category){
      str += comprise(item);
    }
  })
  productWrap.innerHTML = str;

})


//購物車按鈕監聽
productWrap.addEventListener("click",e=>{
  e.preventDefault();
  let addCartClass = e.target.getAttribute("class");
  if( addCartClass !== "addCardBtn"){
    return;
  }
  let productId = e.target.getAttribute("data-id");

  let numCheck = 1;
  cartData.forEach(item=>{
    if(item.product.id === productId){
      numCheck = item.quantity+=1;
    }
  })

  // 加入購物車
  function addCartItem() {
    const url = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`;
    axios.post(url ,{
      data: {
        "productId": productId,
        "quantity": numCheck
      }
    }).
      then(function (response) {
        alert("加入購物車成功！")
        getCartList(); //重新渲染購物車畫面
      })
  }
  addCartItem();
})


let cartData=[];
// 取得購物車列表
function getCartList() {
  const url = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`;
  axios.get(url).
    then(function (response) {
      cartData = response.data.carts;
      document.querySelector(".finalTotal").textContent =`NT ${response.data.finalTotal}`;
      
      let str ="";
      cartData.forEach(item=>{
        str+=`
          <tr class="cartItem">
            <td>
              <div class="cardItem-title">
                <img src="${item.product.images}" alt="">
                <p>${item.product.title}</p>
              </div>
            </td>
            <td>NT$${item.product.price}</td>
            <td>${item.quantity}</td>
            <td>NT$${item.product.price * item.quantity}</td>
            <td class="discardBtn">
              <a href="#" class="material-icons" data-id="${item.id}">
                clear
              </a>
            </td>
          </tr>
        `
      });
      cartList.innerHTML = str;
    })
}

//購物清單內監聽
cartList.addEventListener("click",e=>{
  e.preventDefault();
  const cartId =  e.target.getAttribute("data-id");
  if(cartId == null){
    return;  
  }

  // 刪除購物車內特定產品
  function deleteCartItem(cartId) {
    const url = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`;
    axios.delete(url)
      .then(function (response) {
        alert("刪除單筆產品成功");
        getCartList(); //重新渲染購物車畫面
      })
  }
  deleteCartItem(cartId);
})


// 清除購物車內全部產品
const deleteAllBtn = document.querySelector(".discardAllBtn");
function deleteAllCartList() {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`).
    then(function (response) {
      alert("刪除購物車內全部產品成功！");
      getCartList(); //重新渲染購物車畫面
    })
    .catch(function(response){
      alert("購物車已清空，請勿重複點擊！");
    })
}
deleteAllBtn.addEventListener("click",e=>{
  e.preventDefault();
  deleteAllCartList();
})


const orderInfoBtn = document.querySelector(".orderInfo-btn");
orderInfoBtn.addEventListener("click",e=>{
  e.preventDefault();
  if(cartData.length === 0){
    alert("請先將產品加入購物車！");
    return;
  }
  const customerName = document.querySelector("#customerName").value;
  const customerPhone = document.querySelector("#customerPhone").value;
  const customerEmail = document.querySelector("#customerEmail").value;
  const customerAddress = document.querySelector("#customerAddress").value;
  const tradeWay = document.querySelector("#tradeWay").value;

  if(customerName == "" || customerPhone == "" || customerEmail == "" || customerAddress == "" || tradeWay== ""){
    alert("請完整填寫訂單資訊！")
    return;
  }
  // 送出購買訂單
  function createOrder() {
    const url = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`;
    axios.post(url,
      {
        "data": {
          "user": {
            "name": customerName,
            "tel": customerPhone,
            "email": customerEmail,
            "address": customerAddress ,
            "payment": tradeWay
          }
        }
      }
    ).
      then(function (response) {
        alert("訂單送出成功！");
        getCartList();
        document.querySelector("#customerName").value= "";
        document.querySelector("#customerPhone").value= "";
        document.querySelector("#customerEmail").value= "";
        document.querySelector("#customerAddress").value= "";
        document.querySelector("#tradeWay").value= "ATM";
      })
      .catch(function(error){
        console.log(error.response.data);
      })
  }
  createOrder();
})






