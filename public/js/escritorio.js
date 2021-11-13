// Referencias del HTML
const lblEscritorio  = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const btnTickets = document.querySelector('small');
const divAlerta = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');

const searchParams = new URLSearchParams( window.location.search );

if ( !searchParams.has('escritorio') ) {
    window.location('index.html');
    throw new Error ('Enviar el parametro escritorio es Obligatorio');
}


const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio;

divAlerta.style.display = 'none';

const socket = io();


socket.on('connect', () => {
    btnAtender.disabled = false;
});

socket.on('disconnect', () => {
    btnAtender.disabled = true;
});

socket.on('tickets-pendientes', (pendientes) => {
    console.log(pendientes);
    if (pendientes === 0) {
        lblPendientes.style.display = 'none';
        divAlerta.style.display = '';
    }else{
        lblPendientes.style.display = '';
        divAlerta.style.display = 'none';
        lblPendientes.innerText = pendientes;
    }
});


btnAtender.addEventListener( 'click', () => {

    socket.emit( 'atender-ticket', { escritorio }, ( { ok, ticket, msg } ) => {

        if ( !ok ) {
            btnTickets.innerText = ' Nadie. ';
            return divAlerta.style.display = '';
        }

        btnTickets.innerText = 'Ticket: ' + ticket.numero;

    });

});