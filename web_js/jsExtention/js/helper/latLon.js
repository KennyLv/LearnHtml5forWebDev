/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Latitude/longitude spherical geodesy formula & scripts (c) Chris Veness 2002-2012            */
/*   - www.movable-type.co.uk/scripts/latlong.html                                                */
/*                                                                                                */
/*  Sample usage:                                                                                 */
/*    var p1 = new LatLon(51.5136, -0.0983);                                                      */
/*    var p2 = new LatLon(51.4778, -0.0015);                                                      */
/*    var dist = p1.distanceTo(p2);          // in km                                             */
/*    var brng = p1.bearingTo(p2);           // in degrees clockwise from north                   */
/*    ... etc                                                                                     */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Note that minimal error checking is performed in this example code!                           */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

define(function(){

	/**
	 * Creates a point on the earth's surface at the supplied latitude / longitude
	 *
	 * @constructor
	 * @param {Number} lat: latitude in numeric degrees
	 * @param {Number} lon: longitude in numeric degrees
	 * @param {Number} [rad=6371]: radius of earth if different value is required from standard 6,371km
	 */
	function LatLon(lat, lon, rad) {
		if(typeof rad == 'undefined') {
			rad = 6371;  // earth's mean radius in km
		}

		// only accept numbers or valid numeric strings
		this._lat = typeof lat == 'number' ? lat : typeof lat == 'string' && lat.trim() !== '' ? +lat : NaN;
		this._lon = typeof lon == 'number' ? lon : typeof lon == 'string' && lon.trim() !== '' ? +lon : NaN;
		this._radius = typeof rad == 'number' ? rad : typeof rad == 'string' && lon.trim() !== '' ? +rad : NaN;
	}


	/**
	 * Returns the destination point from this point having traveled the given distance (in km) on the
	 * given initial bearing (bearing may vary before destination is reached)
	 *
	 *   see http://williams.best.vwh.net/avform.htm#LL
	 *
	 * @param   {Number} brng: Initial bearing in degrees
	 * @param   {Number} dist: Distance in km
	 * @returns {Object} Destination point
	 */
	LatLon.prototype.destinationPoint = function(brng, dist) {
		dist = typeof dist == 'number' ? dist : typeof dist == 'string' && dist.trim() !== '' ? +dist : NaN;
		dist = dist/this._radius;  // convert dist to angular distance in radians
		brng = toRad(brng);
		var lat1 = toRad(this._lat),
			lon1 = toRad(this._lon);

		var lat2 = Math.asin( Math.sin(lat1)*Math.cos(dist) + Math.cos(lat1)*Math.sin(dist)*Math.cos(brng) );
		var lon2 = lon1 + Math.atan2(Math.sin(brng)*Math.sin(dist)*Math.cos(lat1),
			Math.cos(dist)-Math.sin(lat1)*Math.sin(lat2));
		lon2 = (lon2+3*Math.PI) % (2*Math.PI) - Math.PI;  // normalise to -180..+180º

		return {
			lat: toDeg(lat2),
			lon: toDeg(lon2)
		};
	};


	/** Converts numeric degrees to radians */
	function toRad(deg) {
		return deg * Math.PI / 180;
	}

	/** Converts radians to numeric (signed) degrees */
	function toDeg(rad) {
		return rad * 180 / Math.PI;
	}


	return LatLon;
});

