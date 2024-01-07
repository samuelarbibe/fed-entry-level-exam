import React from 'react';
import { Ticket } from './api';
export const Tickets = ({ tickets, search, onHideTicket }: { tickets: Ticket[], search: string, onHideTicket: (ticketId: string) => void }) => {

    return (<ul className='tickets'>
        {tickets.map((ticket) => (<li key={ticket.id} className='ticket'>
            <button className='hide-button' onClick={() => onHideTicket(ticket.id)}>
                Hide
            </button>
            <h5 className='title'>{ticket.title}</h5>
            <p className='content'>
                {ticket.content}
            </p>
            <footer>
                <div className='meta-data'>By {ticket.userEmail} | {new Date(ticket.creationTime).toLocaleString()}</div>
            </footer>
        </li>))}
    </ul>);
}