import { Component } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {

  Toppings = [{
    "name": "Tomatoes",
    "category": "Veg",
    "amount": 1.00,
  }, {
    "name": "Onions",
    "category": "Veg",
    "amount": .50,
  },
  {
    "name": "Bell pepper",
    "category": "Veg",
    "amount": 1.00,
  },
  {
    "name": "Mushrooms",
    "category": "Veg",
    "amount": 1.20,
  },
  {
    "name": "Pineapple",
    "category": "Veg",
    "amount": .75,
  },
  {
    "name": "Sausage",
    "category": "Non Veg",
    "amount": 1.00,
  },
  {
    "name": "Pepperoni",
    "category": "Non Veg",
    "amount": 2.00,
  },
  {
    "name": "Chicken",
    "category": "Non Veg",
    "amount": 3.00,
  }]

  Sizes = [{
    "Name": "Small",
    "Amount": 5.00
  },
  {
    "Name": "Medium",
    "Amount": 7.00
  },
  {
    "Name": "Large",
    "Amount": 8.00
  },
  {
    "Name": "Extra Large",
    "Amount": 9.00
  }]
  offers = [{
    "type" : 'fixed',
    "value" : 5,
    "criteria" : {
      toppingQty : 2,
      size : 'Medium',
      Qty : 1
      
    },
    "name" : "Offer 1"
  },
  {
    "type" : 'fixed',
    "value" : 9,
    "criteria" : {
      toppingQty : 4,
      size : 'Medium',
      Qty : 2,
      
    },
    "name" : "Offer 2"
  },
  {
    "type" : 'percent',
    "value" : 50,
    "criteria" : {
      toppingQty : 4,
      size : 'Extra Large',
      Qty : 1,
      
    },
    "name" : "Offer 3"
  }]
  carts: any[] = []
  gorups: any;
  constructor() {

    this.gorups = _.groupBy(this.Toppings.reverse(), "category");
    console.log(this.gorups)
  }

  getToppings(name: any) {

    return _.filter(this.Toppings, { category: name })
  }
  addCart(s: any) {

    var _dccc = document.querySelectorAll(`[data-size='${s.Name}']`)
    var _toppings: any[] = [];
    _dccc.forEach(e => {
      if (e instanceof HTMLInputElement) {
        if (e.checked) {
          _toppings.push(e.dataset.topping)
        }
      }
    })

    if(_toppings.length == 0)
    {
      alert("At-least one topping requried")
      return;
    }
    var _items: any = {
      Toppings: _toppings,
      Qty: 1,
      Size: s.Name,
      Amount : 0 
    }
    _items.Amount = s.Amount + _.chain(this.Toppings)
    .filter(e => _toppings.indexOf(e.name) !== -1)
    .sumBy('amount')
    .value();

    this.carts.push(_items);
    this.calcTotal();
    this.removeOffers();
    this.clear(s);
  }

  totalDiscount = 0;
  basePrice = 0;
  applyOffered:any[] = [];
  removeOffers (){
    this.applyOffered = [];
    this.totalDiscount = 0;
    this.calcTotal();
  }
  applyOffers() {
    let totalDiscount = 0; // Initialize total discount
    this.applyOffered = [];
    this.carts.forEach(item => {
      this.offers.forEach(offer => {
        const criteria = offer.criteria;
        if (
          item.Toppings.length >= criteria.toppingQty &&
          item.Size === criteria.size &&
          item.Qty >= criteria.Qty
        ) {
          this.applyOffered.push(offer)
          if (offer.type === 'fixed') {
            totalDiscount += offer.value;
          } else if (offer.type === 'percent') {
            const discount = (offer.value / 100) * item.Amount;
            totalDiscount += discount;
          }
        }
      });
    });
    this.totalDiscount = totalDiscount;
    this.total = this.basePrice - totalDiscount; // Apply the total discount
  }
  
  clear(s:any){
    var _dccc = document.querySelectorAll(`[data-size='${s.Name}']`)
    _dccc.forEach(e => {
      if (e instanceof HTMLInputElement) {
        e.checked = false;
      }
    })
  }
  total = 0;
  calcTotal(){
    this.basePrice = Number(_.sumBy(this.carts, 'Amount').toFixed(2));
    this.total = this.basePrice - this.totalDiscount 
  }

  removeItem(index: number) {
    this.carts.splice(index, 1);
    this.calcTotal();
    this.removeOffers();
  }
}


