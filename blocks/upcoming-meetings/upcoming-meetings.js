import { domEl } from '../../scripts/dom-helpers.js';

const RECENT_DAYS = 60;
const MONTH = ( d ) => d.toLocaleDateString( 'en-US', { month: 'short' } ).toUpperCase();

/**
 * Fetches the workbook: sheet "meetings" (one row per meeting) and sheet "documents" (one row per file).
 * @param {string} href authored link to the workbook
 * @returns {Promise<Array>} meetings with their documents attached
 */
async function fetchMeetings( href ) {
	const resp = await fetch( new URL( href, window.location.href ) );
	if ( !resp.ok ) throw new Error( `upcoming-meetings: ${resp.status} for ${href}` );
	const json = await resp.json();
	const meetings = ( json.meetings && json.meetings.data ) || [];
	const documents = ( json.documents && json.documents.data ) || [];
	return meetings.map( ( m ) => ( { ...m, docs: documents.filter( ( d ) => d.meeting === m.id ) } ) );
}

/** @returns {Date} end of the meeting (end time, else end of that day) */
const endOf = ( m ) => new Date( m.end || `${m.date}T23:59` );
const dayOf = ( m ) => new Date( `${m.date}T12:00:00` );

/**
 * Builds a downloadable calendar entry (.ics) for a meeting.
 * @param {object} m meeting
 * @returns {string} data URL
 */
function icsHref( m ) {
	const stamp = ( iso ) => {
		const s = iso.replace( /[-:]/g, '' ).slice( 0, 15 );
		return s.length === 13 ? `${s}00` : s;
	};
	const lines = [
		'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Nebraska Children\'s Commission//Meetings//EN', 'BEGIN:VEVENT',
		`UID:${m.id}@childrens.nebraska.gov`, `DTSTAMP:${stamp( new Date().toISOString() )}Z`,
		`DTSTART;TZID=America/Chicago:${stamp( m.start )}`, `DTEND;TZID=America/Chicago:${stamp( m.end )}`,
		`SUMMARY:${m.group} meeting`, `LOCATION:${m.location.replace( /\n/g, ', ' )}`,
		m.virtual_url ? `DESCRIPTION:${m.virtual_label || 'Join online'}: ${m.virtual_url}` : null,
		'END:VEVENT', 'END:VCALENDAR',
	].filter( Boolean );
	return `data:text/calendar;charset=utf-8,${encodeURIComponent( lines.join( '\r\n' ) )}`;
}

function renderMeeting( m, upcoming ) {
	const day = dayOf( m );
	const agenda = m.docs.filter( ( d ) => d.type === 'agenda' );
	const handouts = m.docs.filter( ( d ) => d.type !== 'agenda' );
	const docLink = ( d, cls = 'usa-link usa-link--pdf' ) => {
		const attrs = { href: d.url, class: cls, target: '_blank' };
		if ( d.type === 'agenda' ) {
			attrs['aria-label'] = `${d.title}, ${m.group}, ${day.toLocaleDateString( 'en-US', { month: 'long', day: 'numeric', year: 'numeric' } )}`;
		}
		return domEl( 'a', attrs, d.action ? domEl( 'strong', {}, d.title ) : d.title );
	};

	const where = domEl( 'address', { class: 'upcoming-meetings__where' } );
	m.location.split( '\n' ).filter( Boolean ).forEach( ( line, i ) => {
		if ( i ) where.append( domEl( 'br' ) );
		where.append( line );
	} );

	const body = domEl( 'div', { class: 'upcoming-meetings__body' },
		domEl( 'h3', { class: 'upcoming-meetings__group' }, m.group ),
		domEl( 'p', { class: 'upcoming-meetings__when' },
			domEl( 'time', { datetime: m.start || m.date }, day.toLocaleDateString( 'en-US', {
				weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
			} ) ),
			m.when ? domEl( 'span', { class: 'upcoming-meetings__time' }, m.when ) : '' ),
		where );
	if ( m.virtual_url ) {
		body.append( domEl( 'p', { class: 'upcoming-meetings__virtual' },
			domEl( 'a', { href: m.virtual_url, class: 'usa-link usa-link--external', target: '_blank' }, m.virtual_label || 'Join online' ) ) );
	}
	if ( agenda.length ) {
		body.append( domEl( 'p', { class: 'upcoming-meetings__agenda' }, ...agenda.map( ( d ) => docLink( d, 'usa-button usa-button--outline' ) ) ) );
	}
	if ( handouts.length ) {
		body.append( domEl( 'p', { class: 'upcoming-meetings__label' }, 'Meeting handouts' ),
			domEl( 'ul', { class: 'upcoming-meetings__docs usa-list' }, ...handouts.map( ( d ) => domEl( 'li', {}, docLink( d ) ) ) ) );
	}
	if ( upcoming && m.start && m.end ) {
		body.append( domEl( 'p', { class: 'upcoming-meetings__cal' },
			domEl( 'a', { href: icsHref( m ), download: `${m.id}.ics`, class: 'usa-link' }, 'Add to calendar' ) ) );
	}
	return domEl( 'li', { class: 'upcoming-meetings__item' },
		domEl( 'div', { class: 'upcoming-meetings__badge', 'aria-hidden': 'true' },
			domEl( 'span', { class: 'upcoming-meetings__month' }, MONTH( day ) ),
			domEl( 'span', { class: 'upcoming-meetings__day' }, String( day.getDate() ) ) ),
		body );
}

function section( id, heading, items, upcoming ) {
	return domEl( 'section', { class: 'upcoming-meetings__section', 'aria-labelledby': id },
		domEl( 'h2', { id }, heading ),
		domEl( 'ol', { class: 'upcoming-meetings__list' }, ...items.map( ( m ) => renderMeeting( m, upcoming ) ) ) );
}

/**
 * Upcoming and recent meetings, with agendas and handouts, from one workbook.
 * Authoring: a single link to the workbook (e.g. /data/upcoming-meetings.json). Meetings move from
 * "Upcoming" to "Recently held" on their own, and drop off after 60 days.
 * @param {HTMLElement} block The block element
 */
export default async function decorate( block ) {
	const link = block.querySelector( 'a' );
	if ( !link ) return;
	const archive = link.dataset.archive || '/meetings';
	block.textContent = '';
	let meetings;
	try {
		meetings = await fetchMeetings( link.href );
	} catch ( e ) {
		// eslint-disable-next-line no-console
		console.error( e );
		block.append( domEl( 'p', { class: 'upcoming-meetings__error' }, 'Meeting information is unavailable right now. Please try again later.' ) );
		return;
	}
	const now = new Date();
	const cutoff = new Date( now.getTime() - RECENT_DAYS * 86400000 );
	const upcoming = meetings.filter( ( m ) => endOf( m ) >= now ).sort( ( a, b ) => a.date.localeCompare( b.date ) );
	const recent = meetings.filter( ( m ) => endOf( m ) < now && endOf( m ) >= cutoff ).sort( ( a, b ) => b.date.localeCompare( a.date ) );

	if ( upcoming.length ) block.append( section( 'um-upcoming', 'Upcoming meetings', upcoming, true ) );
	else {
		block.append( domEl( 'section', { class: 'upcoming-meetings__section' }, domEl( 'h2', {}, 'Upcoming meetings' ),
			domEl( 'p', {}, 'No meetings are scheduled right now. Earlier meetings are in the ',
				domEl( 'a', { href: archive, class: 'usa-link' }, 'meeting archive' ), '.' ) ) );
	}
	if ( recent.length ) block.append( section( 'um-recent', 'Recently held', recent, false ) );
	if ( meetings.some( ( m ) => m.docs.some( ( d ) => d.action ) ) ) {
		block.append( domEl( 'p', { class: 'upcoming-meetings__legend' }, 'Items noted in bold indicate potential action items' ) );
	}
}
