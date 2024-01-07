import React from 'react';
import './App.scss';
import { Tickets } from './Tickets';
import { createApiClient, Ticket } from './api';

export type AppState = {
	tickets?: Ticket[],
	search: string;
}

const api = createApiClient();
const App = () => {
	const [search, setSearch] =
		React.useState<string>('');
	const [tickets, setTickets] =
		React.useState<Ticket[]>([]);
	const [hiddenTickets, setHiddenTickets] = React.useState<Record<string, boolean>>({})

	const filteredTickets = React.useMemo(() => tickets
		.filter((t) =>
			!hiddenTickets[t.id] &&
			(t.title.toLowerCase() + t.content.toLowerCase()).includes(search.toLowerCase()))
		, [tickets, search, hiddenTickets]);

	React.useEffect(() => {
		async function fetchTickets() {
			setTickets(await api.getTickets())
		}
		fetchTickets()
	}, []);

	let searchDebounce: any;

	const onSearch = (val: string, newPage?: number) => {
		clearTimeout(searchDebounce);
		searchDebounce = setTimeout(async () => {
			setSearch(val)
		}, 300);
	}

	const onHideTicket = (ticketId: string) => {
		setHiddenTickets((prev) => ({ ...prev, [ticketId]: true }))
	}

	const handleOnRestoreHidden = () => {
		setHiddenTickets({})
	}

	const filteredTicketsCount = Object.values(hiddenTickets).filter(Boolean).length;

	return (
		<main>
			<h1>Tickets List</h1>
			<header>
				<input type="search" placeholder="Search..." onChange={(e) => onSearch(e.target.value)} />
			</header>
			{tickets
				? <div className='results'>
					<span>
						Showing {tickets.length} results
					</span>
					{
						filteredTicketsCount
							? <span className='restore-hidden'>
								{" ("}
								{`${filteredTicketsCount} hidden tickets - `}
								<button onClick={handleOnRestoreHidden}>restore</button>
								{")"}
							</span>
							: null
					}
				</div>
				: null
			}
			{tickets ? <Tickets tickets={filteredTickets} search={search} onHideTicket={onHideTicket} /> : <h2>Loading..</h2>}
		</main>);
}
export default App;