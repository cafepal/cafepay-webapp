/** Model definition file for the Movie Class **/

// const identicon = require('identicon')
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-bottts-sprites';

export const Table = class Table {
  constructor(rawData = {}, currentUserId = {}) {


    let data = this.productsByPerson(rawData.bill_products, currentUserId)
    let myProfileOnTable = data.personRawProduct.find(p => p.id == currentUserId)
    if (myProfileOnTable && data.personRawProduct.length > 1) {
      data.personRawProduct = data.personRawProduct.filter(p => p.id != currentUserId)
      data.personRawProduct.unshift(myProfileOnTable)
      console.log('persons no order', data.personRawProduct);
    }
    this.persons = data.personRawProduct
    this.paid = data.paid
    this.status = data.status
    this.paymentMethod = data.paymentMethod
    this.hasOnlinePayment = data.hasOnlinePayment
    


  }

  productsByPerson(arr, currentUserId) {
    let personRawProduct_noProperty = [...arr.reduce((acc, obj) =>
      acc.set(obj.user_profile.pk, (acc.get(obj.user_profile.pk) || []).concat(obj)), new Map).values()];

    let personRawProduct = []
    let paid = true
    let status = (personRawProduct_noProperty.length) ? 'ready' : 'no_order'
    let paymentMethod = 'online'
    let hasOnlinePayment = false
    personRawProduct_noProperty.forEach(orders => {
      // make orders from product class
      let newOrders = []
      let user_name;
      let identiconId;
      let userId;
      let wish_to_pay;
      let cashier = false

      orders.forEach(order => {
        // fall in chain
        if (!order.is_ready) status = 'preparing'
        if (!order.sent_to_kitchen) status = 'confirmed'
        if (!order.is_accepted) status = 'waiting'
        // set method
        if (order.preferred_payment_method == 0 && order.payment_info.net_payed_amount != order.payment_info.total_amount) hasOnlinePayment = true
        else paymentMethod = 'cash'
         
        user_name =  order.user_profile.full_name
        if (order.is_staff) {
          user_name = 'صندوق دار'
          if (!cashier) cashier = true
        }
        userId = order.user_profile.pk
        
        // if order is belong to user (not others) slider will be full
        if (userId == currentUserId) wish_to_pay = order.payment_info.total_amount - order.payment_info.net_payed_amount
        else wish_to_pay = 0
        // build new object with addition of wish to pay and name of product
        let prodObj = {
          ...order,
          wish_to_pay,
          cashier_count: 0,
          name: order.product_data.name,
        }
        
        // generate id for identicon base on full_name + phone number
        identiconId = order.user_profile.full_name + userId
        // user info is in each order so remove it from them and add to parent (person)
        delete prodObj.user_profile

        newOrders.push(prodObj)
      });
      // we need to calculate total price of the orders of a person and total payment on them
      let totalPrice = newOrders.reduce(
        (total, order) => order.payment_info.total_amount + total, 0)

      let totalPaid = newOrders.reduce(
        (total, order) => order.payment_info.net_payed_amount + total, 0)
      let avatar;

      if (paid) {
        if (totalPaid != totalPrice) paid = false
      } 

      let avatars = new Avatars(sprites);
      avatar = avatars.create(identiconId, {
        base64: true
      });

      // push new person along side his products
      personRawProduct.push({
        totalPrice,
        totalPaid,
        avatar,
        cashier,
        name: user_name.slice(0, 20),
        orders: newOrders,
        id: userId
      })
    });
    return {
      personRawProduct,
      status,
      paid,
      paymentMethod,
      hasOnlinePayment
    }
  }




}

// export const Product = class Product {
//   constructor(product = {}, products = []) {
//     let localProduct = products.find(x => x.pk = product.pk)
//     this.name = rawData.title
//     this.name = 'پیتزا قارچ و گوشت'
//     this.original_price = 45000
//     this.discount = 0
//     this.paid = 0
//     this.wish_to_pay = 0
//     this.you_paid = 0
//     this.price = 45000
//     this.count = 2
//   }


// }
