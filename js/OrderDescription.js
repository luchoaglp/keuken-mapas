class OrderDescription {
 
    setDate(date) {
        this.date = moment(date).format('DD/MM/YYYY hh:mm:ss');
    }

    setCounter(counter) {
        this.counter = counter;
    }

    setPdv(pdv) {
        this.pdv = pdv;
    }

    setNoSaleReason(noSaleReason) {
        this.noSaleReason = noSaleReason;
    }

    setOrderTotal(orderTotal) {
        this.orderTotal = orderTotal;
    }

    setPdvOrder(pdvOrder) {
        this.pdvOrder = pdvOrder;
    }

    setDistPdvOrder(distPdvOrder) {
        this.distPdvOrder = distPdvOrder;
    }

    toStr() {
        let str = this.date;
        str += '<h5>';
        str += this.counter ? `<span class="badge badge-default">${this.counter}</span> ` : '';
        str += `<span class="badge badge-info">${this.pdv}</span></h5>`;
        str += `<b>${this.noSaleReason}</b>`;
        str += this.orderTotal > 0 ? `<br>Total: $${this.orderTotal}` : '';
        str += this.distPdvOrder ? `<br>Distancia: <a href="#">${this.distPdvOrder} Km</a>` : '';
        return str;
    }

}