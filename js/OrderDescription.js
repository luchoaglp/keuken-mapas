class OrderDescription {
 
    setDate(date) {
        this.date = date;
    }
    
    setPdv(pdv) {
        this.pdv = pdv;
    }

    setPdvNombre(pdvNombre) {
        this.pdvNombre = pdvNombre;
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
    
    setBadgeColor(badgeColor) {
        this.badgeColor = badgeColor;
    }

    setItems(items) {
        if(items) {
            this.items = items;
        }
    }

    toStr() {
        let str = this.date;
        str += `<h5><span class="badge badge-success">PDV: ${this.pdv}</span> <span class="badge" style="background:${this.badgeColor}">${this.pdvNombre}</span></h5>`;
        str += `<b>${this.noSaleReason}</b>`;
        str += this.orderTotal > 0 ? `<br>Total: $${this.orderTotal}` : '';
        str += this.distPdvOrder ? `<br>Distancia: <a href="#">${this.distPdvOrder} Km</a>` : '';
        str += this.items ? `<br><a href="#" onclick="showModal(${this.pdv})">Detalle</a>` : '';
        return str;
    }

}