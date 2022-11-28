//初始化
function init(){
	getOrderList();
}
init();

// 取得訂單列表
let orderData = [];
const orderList = document.querySelector(".js-orderList");
function getOrderList() {
	const url =`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`;
	axios.get(url,
	{
		headers: {
			'Authorization': token
		}
	})
	.then(function (response) {
		orderData = response.data.orders;
		let str = "";
		orderData.forEach(item=>{
			//組時間字串
			const timeStamp = new Date(item.createdAt*1000);
			const orderTime = `${timeStamp.getFullYear()}/${timeStamp.getMonth()}/${timeStamp.getDate()}`;
		
			//組產品項目的字串
			let ProductStr = "";
			item.products.forEach(i=>{
				ProductStr+=`<p>${i.title} x${i.quantity}</p>`
			})

			//判斷訂單狀態
			let orderStatus = "";
			if(item.paid == true){
				orderStatus = "已處理";
			}else{
				orderStatus = "未處理";
			}

			//訂單
			str+=`
				<tr>
					<td>${item.id}</td>
					<td>
						<p>${item.user.name}</p>
						<p>${item.user.tel}</p>
					</td>
					<td>${item.user.address}</td>
					<td>${item.user.email}</td>
					<td>
						${ProductStr}
					</td>
					<td>${orderTime}</td>
					<td class="js-orderStatus">
						<a href="#" class="orderStatus" data-status="${item.paid}" data-id="${item.id}">${orderStatus}</a>
					</td>
					<td>
						<input type="button" class="delSingleOrder-Btn js-orderDelete" data-id="${item.id}" value="刪除">
					</td>
				</tr>
			`;
		})
		orderList.innerHTML = str;
		renderC3();
	})
}

//訂單操作
orderList.addEventListener("click",e=>{
	e.preventDefault();
	const targetClass = e.target.getAttribute("class");
	let id = e.target.getAttribute("data-id");
	if(targetClass == "delSingleOrder-Btn js-orderDelete"){
		deleteOrderItem(id);
		return;
	}
	
	if(targetClass == "orderStatus"){
		let status = e.target.getAttribute("data-status");
		editOrderList(status,id);
		return;
	}
})

// 修改訂單狀態
function editOrderList(status,id) {
	let newStatus ;
	if(status == "false"){
		newStatus=true;
	}else{
		newStatus=false;
	};
	
	const url = `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`;
	axios.put(url,
	{
		"data": {
			"id": id,
			"paid": newStatus
		}
	},
	{
		headers: {
		'Authorization': token
		}
	})
	.then(function (response) {
		alert("修改訂單狀態成功！");
		getOrderList();
	})
}

// 刪除特定訂單
function deleteOrderItem(id) {
	const url = `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${id}`;
	axios.delete(url,{
			headers: {
			'Authorization': token
			}
	})
	.then(function (response) {
		alert("刪除單筆訂單成功！");
		getOrderList();
	})
}

// 刪除全部訂單
// function deleteAllOrder() {
// 	axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
// 	{
// 			headers: {
// 			'Authorization': token
// 			}
// 	})
// 	.then(function (response) {
// 			console.log(response.data);
// 	})
// }

// C3.js
function renderC3(){
	console.log(orderData);
	let total = {};
	orderData.forEach(item=>{
		item.products.forEach(i=>{
			if(total[i.category] == undefined){
				total[i.category] = i.price * i.quantity;
			}else{
				total[i.category] += i.price * i.quantity;
			}
		})
	})
	console.log(total);
	//做出資料關聯
	let categoryAry = Object.keys(total);
	let newData =[];
	categoryAry.forEach(item=>{
		let ary = [];
		ary.push(item);
		ary.push(total[item]);
		newData.push(ary);
	})

	let chart = c3.generate({
		bindto: '#chart', // HTML 元素綁定
		data: {
			type: "pie",
			columns: newData,
			colors:{
				"床架": "#301E5F",
				"窗簾": "#9D7FEA",
				"收納": "#5434A7",
				"其他": "#DACBFF",
			}
		},
	});
}


// 預設 JS，請同學不要修改此處
let menuOpenBtn = document.querySelector('.menuToggle');
let linkBtn = document.querySelectorAll('.topBar-menu a');
let menu = document.querySelector('.topBar-menu');
menuOpenBtn.addEventListener('click', menuToggle);

linkBtn.forEach((item) => {
    item.addEventListener('click', closeMenu);
})

function menuToggle() {
    if(menu.classList.contains('openMenu')) {
        menu.classList.remove('openMenu');
    }else {
        menu.classList.add('openMenu');
    }
}
function closeMenu() {
    menu.classList.remove('openMenu');
}

// 預設 JS，請同學不要修改此處


