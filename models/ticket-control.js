const path = require('path');
const fs = require("fs");
const Ticket = require('./ticket')


class TicketControl {


    constructor(){
        this.ultimo    = 0;                     // Ultimo ticket
        this.hoy       = new Date().getDate();  // Fecha de hoy
        this.tickets   = [];                    // Todos los tickets pendientes
        this.ultimos4  = [];                    // Ultimos 4 tickets

        this.init();
    }
    // Obtenemos en formato json para guardarlo en la BD
    get toJson(){
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4,
        };
    }
    // Método para inicializar los valores
    init(){
        const { ultimo, hoy, tickets, ultimos4 } = require('../data/data.json');
        if (hoy === this.hoy) {
            this.tickets = tickets;
            this.ultimo = ultimo;
            this.tickets = tickets;
			this.ultimos4 = ultimos4;
        } else {
            // Es otro día
            this.guardarDB();
        }
    }
    // Método de guardar en la BD
    guardarDB(){

        const dbpath = path.join(__dirname, '../data/data.json');
        fs.writeFileSync(dbpath, JSON.stringify(this.toJson));
    }
    // Método para asignar cual es el siguiente ticket
    siguiente(){
        this.ultimo += 1;
        const ticket = new Ticket(this.ultimo, null);
        this.tickets.push(ticket);

        this.guardarDB();
        return 'Ticket: '+ticket.numero;
    }
    // Método para atender los tickets
    atenderTicket(escritorio){
        // No tenemos tickets
        if (this.tickets.length === 0 ) {
            return null;
        }

        const ticket = this.tickets.shift(); // this.tickets[0]
        ticket.escritorio = escritorio;

        this.ultimos4.unshift(ticket);
        if (this.ultimos4.length > 4) {
            this.ultimos4.splice(-1,1);
        }
        this.guardarDB();
        return ticket;
    }

}

module.exports = TicketControl;