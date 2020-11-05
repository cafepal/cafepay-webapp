/** Model definition file for the Movie Class **/

// const identicon = require('identicon')
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-bottts-sprites';

export const Table = class Table {
  constructor(rawData = {}, products = {}, currentUserId = {}) {


    let notSortedPersons = this.productsByPerson(rawData.bill_products, products, currentUserId)
    let myProfileOnTable = notSortedPersons.find(p => p.id == currentUserId)
    if (myProfileOnTable && notSortedPersons.length > 1) {
      notSortedPersons = notSortedPersons.filter(p => p.id != currentUserId)
      notSortedPersons.unshift(myProfileOnTable)
      console.log('persons no order', notSortedPersons);
    }
    this.persons = notSortedPersons
    

  }

  productsByPerson(arr, products, currentUserId) {
    let personRawProduct_noProperty = [...arr.reduce((acc, obj) =>
      acc.set(obj.user_profile.pk, (acc.get(obj.user_profile.pk) || []).concat(obj)), new Map).values()];

    let personRawProduct = []
    personRawProduct_noProperty.forEach(orders => {
      // make orders from product class
      let newOrders = []
      let user_name;
      let identiconId;
      let userId;
      let wish_to_pay;
      
      
      orders.forEach(order => {
        let findProduct = products.find(x => x.pk == order.product)

        // user info is in each order so remove it from them and add to parent (person)
        user_name = (order.is_staff) ? 'صندوق دار' : order.user_profile.full_name
        userId = order.user_profile.pk

        // if order is belong to user (not others) slider will be full
        if (userId == currentUserId) wish_to_pay = order.payment_info.total_amount - order.payment_info.payed_amount
        else wish_to_pay = 0
        // build new object with addition of wish to pay and name of product
        let prodObj = {
          ...order,
          wish_to_pay,
          name: findProduct.name,
        }

        // generate id for identicon base on full_name + phone number
        identiconId = order.user_profile.full_name + userId
        // user_name = order.user_profile.full_name
        delete prodObj.user_profile

        newOrders.push(prodObj)
      });
      // we need to calculate total price of the orders of a person and total payment on them
      let totalPrice = newOrders.reduce(
        (total, order) => order.payment_info.total_amount + total, 0)

      let totalPaid = newOrders.reduce(
        (total, order) => order.payment_info.payed_amount + total, 0)
        let avatar;
        
        let avatars = new Avatars(sprites);
        avatar = avatars.create(identiconId, {
          base64: true
        });

      // push new person along side his products
      personRawProduct.push({
        totalPrice,
        totalPaid,
        avatar,
        name: user_name.slice(0, 20),
        orders: newOrders,
        id: userId
      })
    });
    return personRawProduct
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
