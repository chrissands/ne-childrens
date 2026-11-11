import { toClassName } from '../../scripts/aem.js';
import { domEl } from '../../scripts/dom-helpers.js';

const PAGE_SIZE = 20;
const TYPE_LABEL = { agenda: 'Agenda', minutes: 'Minutes' };

/**
 * Fetches the meeting sheet (one row per document: group, slug, date, type, title, url, note).
 * @param {string} href URL authored in the block
 * @returns {Promise<Array>} sheet rows
 */
async function fetchSheet( href ) {
	const url = new URL( href, window.location.href );
	url.searchParams.set( 'limit', '10000' );
	const resp = await fetch( url );
	if ( !resp.ok ) throw new Error( `meeting-archive: ${resp.status} for ${url}` );
	const json = await resp.json();
	return json.data || [];
}

/**
 * Groups document rows into meetings, newest first.
 * @param {Array} rows sheet rows
 * @returns {Array} meetings with their documents
 */
function toMeetings( rows ) {
	const map = new Map();
	rows.forEach( ( row ) => {
		const key = `${row.group}|${row.date}`;
		if ( !map.has( key ) ) {
			map.set( key, {
				group: row.group, slug: row.slug || toClassName( row.group ), date: row.date, year: row.date.slice( 0, 4 ), note: '', docs: [],
			} );
		}
		const meeting = map.get( key );
		if ( row.note && !meeting.note ) meeting.note = row.note;
		if ( row.url ) meeting.docs.push( { type: row.type, title: row.title, url: row.url } );
	} );
	return [...map.values()].sort( ( a, b ) => b.date.localeCompare( a.date ) || a.group.localeCompare( b.group ) );
}

const formatDate = ( iso ) => new Date( `${iso}T12:00:00` ).toLocaleDateString( 'en-US', {
	year: 'numeric', month: 'long', day: 'numeric',
} );

/**
 * Builds one meeting card.
 * @param {object} meeting grouped meeting
 * @param {boolean} showGroup whether to label the committee
 * @returns {HTMLElement} list item
 */
function renderMeeting( meeting, showGroup ) {
	const primary = meeting.docs.filter( ( d ) => d.type === 'agenda' || d.type === 'minutes' );
	const handouts = meeting.docs.filter( ( d ) => d.type === 'handout' );
	const additional = meeting.docs.filter( ( d ) => d.type === 'additional' );

	const li = domEl( 'li', { class: 'meeting-archive__meeting' } );
	const head = domEl( 'div', { class: 'meeting-archive__head' },
		domEl( 'h3', { class: 'meeting-archive__date' }, domEl( 'time', { datetime: meeting.date }, formatDate( meeting.date ) ) ) );
	if ( showGroup ) head.append( domEl( 'p', { class: 'meeting-archive__group' }, meeting.group ) );
	li.append( head );
	if ( meeting.note ) li.append( domEl( 'p', { class: 'meeting-archive__note' }, meeting.note ) );

	if ( primary.length ) {
		const ul = domEl( 'ul', { class: 'meeting-archive__primary usa-list usa-list--unstyled' } );
		primary.forEach( ( d ) => {
			ul.append( domEl( 'li', {},
				domEl( 'a', {
					href: d.url,
					class: 'usa-link usa-link--pdf meeting-archive__doc',
					target: '_blank',
					'aria-label': `${TYPE_LABEL[d.type]}, ${meeting.group}, ${formatDate( meeting.date )}`,
				}, TYPE_LABEL[d.type] ) ) );
		} );
		li.append( ul );
	}

	[['Meeting handouts', handouts], ['Additional materials', additional]].forEach( ( [label, docs] ) => {
		if ( !docs.length ) return;
		const list = domEl( 'ul', { class: 'meeting-archive__materials usa-list' } );
		docs.forEach( ( d ) => list.append( domEl( 'li', {},
			domEl( 'a', { href: d.url, class: 'usa-link usa-link--pdf', target: '_blank' }, d.title ) ) ) );
		li.append( domEl( 'details', { class: 'meeting-archive__details' },
			domEl( 'summary', {}, `${label} (${docs.length})` ), list ) );
	} );

	if ( !meeting.docs.length ) li.append( domEl( 'p', { class: 'meeting-archive__empty-doc' }, 'No documents posted.' ) );
	return li;
}

function field( id, label, control ) {
	return domEl( 'div', { class: 'meeting-archive__field' }, domEl( 'label', { for: id }, label ), control );
}

/**
 * Meeting archive: filter, search and browse every meeting's documents from one data sheet.
 * Authoring: a single link to the sheet (e.g. /data/meetings.json). Supports ?group=&year=&q=.
 * @param {HTMLElement} block The block element
 */
export default async function decorate( block ) {
	const link = block.querySelector( 'a' );
	if ( !link ) return;
	block.textContent = '';
	block.setAttribute( 'aria-busy', 'true' );

	let meetings;
	try {
		meetings = toMeetings( await fetchSheet( link.href ) );
	} catch ( e ) {
		// eslint-disable-next-line no-console
		console.error( e );
		block.append( domEl( 'p', { class: 'meeting-archive__error' }, 'Meeting documents are unavailable right now. Please try again later.' ) );
		block.removeAttribute( 'aria-busy' );
		return;
	}

	const groups = [...new Map( meetings.map( ( m ) => [m.slug, m.group] ) ).entries()].sort( ( a, b ) => a[1].localeCompare( b[1] ) );
	const params = new URLSearchParams( window.location.search );
	const state = {
		group: params.get( 'group' ) || '', year: params.get( 'year' ) || '', q: params.get( 'q' ) || '', shown: PAGE_SIZE,
	};

	const groupSelect = domEl( 'select', { id: 'ma-group', class: 'meeting-archive__select' }, domEl( 'option', { value: '' }, 'All groups' ),
		...groups.map( ( [slug, name] ) => domEl( 'option', { value: slug }, name ) ) );
	const yearSelect = domEl( 'select', { id: 'ma-year', class: 'meeting-archive__select' } );
	const search = domEl( 'input', {
		id: 'ma-q', class: 'meeting-archive__input', type: 'search', autocomplete: 'off', placeholder: 'Agenda, minutes, report title',
	} );
	const reset = domEl( 'button', { type: 'button', class: 'usa-button usa-button--outline meeting-archive__reset' }, 'Clear filters' );
	const form = domEl( 'form', { class: 'meeting-archive__filters', role: 'search', 'aria-label': 'Filter meeting documents' },
		field( 'ma-group', 'Group', groupSelect ), field( 'ma-year', 'Year', yearSelect ),
		field( 'ma-q', 'Search documents', search ), reset );
	const count = domEl( 'p', { class: 'meeting-archive__count', role: 'status', 'aria-live': 'polite' } );
	const list = domEl( 'ol', { class: 'meeting-archive__list' } );
	const more = domEl( 'button', { type: 'button', class: 'usa-button meeting-archive__more' }, 'Show more meetings' );
	block.append( form, count, list, domEl( 'div', { class: 'meeting-archive__footer' }, more ) );

	const matches = () => {
		const needle = state.q.trim().toLowerCase();
		return meetings.filter( ( m ) => ( !state.group || m.slug === state.group )
			&& ( !state.year || m.year === state.year )
			&& ( !needle || m.docs.some( ( d ) => d.title.toLowerCase().includes( needle ) )
				|| m.note.toLowerCase().includes( needle ) || m.group.toLowerCase().includes( needle ) ) );
	};

	const fillYears = () => {
		const years = [...new Set( meetings.filter( ( m ) => !state.group || m.slug === state.group ).map( ( m ) => m.year ) )].sort().reverse();
		if ( state.year && !years.includes( state.year ) ) state.year = '';
		yearSelect.replaceChildren( domEl( 'option', { value: '' }, 'All years' ), ...years.map( ( y ) => domEl( 'option', { value: y }, y ) ) );
		yearSelect.value = state.year;
	};

	const render = ( keepShown ) => {
		if ( !keepShown ) state.shown = PAGE_SIZE;
		const found = matches();
		const visible = found.slice( 0, state.shown );
		list.replaceChildren( ...visible.map( ( m ) => renderMeeting( m, !state.group ) ) );
		const docCount = found.reduce( ( n, m ) => n + m.docs.length, 0 );
		count.textContent = found.length
			? `${found.length} ${found.length === 1 ? 'meeting' : 'meetings'}, ${docCount} documents${found.length > visible.length ? ` (showing ${visible.length})` : ''}`
			: 'No meetings match these filters.';
		more.hidden = found.length <= visible.length;
		const next = new URLSearchParams();
		if ( state.group ) next.set( 'group', state.group );
		if ( state.year ) next.set( 'year', state.year );
		if ( state.q.trim() ) next.set( 'q', state.q.trim() );
		const qs = next.toString();
		window.history.replaceState( null, '', `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}` );
	};

	groupSelect.value = groups.some( ( [slug] ) => slug === state.group ) ? state.group : '';
	state.group = groupSelect.value;
	search.value = state.q;
	fillYears();

	groupSelect.addEventListener( 'change', () => { state.group = groupSelect.value; fillYears(); render(); } );
	yearSelect.addEventListener( 'change', () => { state.year = yearSelect.value; render(); } );
	let timer;
	search.addEventListener( 'input', () => { clearTimeout( timer ); timer = setTimeout( () => { state.q = search.value; render(); }, 200 ); } );
	form.addEventListener( 'submit', ( e ) => e.preventDefault() );
	reset.addEventListener( 'click', () => {
		Object.assign( state, { group: '', year: '', q: '' } );
		groupSelect.value = ''; search.value = ''; fillYears(); render();
	} );
	more.addEventListener( 'click', () => { state.shown += PAGE_SIZE; render( true ); } );

	render();
	block.removeAttribute( 'aria-busy' );
}
