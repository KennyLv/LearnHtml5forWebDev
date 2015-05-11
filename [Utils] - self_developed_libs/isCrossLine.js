/*
 * Javascript Version
 */
function IsCorssLine(Line1, Line2){
		var x1 = Line1.startPoint.X;
		var y1 = Line1.startPoint.Y;
		var x2 = Line1.EndPoint.X;
		var y2 = Line1.EndPoint.Y;
		var x3 = Line2.startPoint.X;
		var y3 = Line2.startPoint.Y;
		var x4 = Line2.EndPoint.X;
		var y4 = Line2.EndPoint.Y;
		//we assume the beeline as 
		//1: y = ax + b  (y1=ax1+b, y2=ax2+b)
		//2: y = mx + n  (y3=mx3+n, y4=mx4+n)
		var a = (y1 - y2) / (x1 - x2);
		var b = y1 - a * x1;
		var m = (y3 - y4) / (x3 - x4);
		var n = y3 - m * x3;

		if (a == m) {
				//means the two beelines are parallel
				return false;
		}

		//now, let's get the corss point of the two lines
		var X = (n - b) / (a - m);
		var Y = a * X + b;

		//now, let's check whether (X,Y) is between (x1,y1) and (x2,y2), and between (x3,y3) and (x4,y4)
		var xBetweenLine1 = yBetweenLine1 = xBetweenLine2 = yBetweenLine2 = false;
		if( ((X >= x1)&&(x2 >= X)) || ((X <= x1)&&(x2 <= X)) ) {
				xBetweenLine1 = true;
		}
		if (((Y >= y1) && (y2 >= Y)) || ((Y <= y1) && (y2 <= Y))) {
				yBetweenLine1 = true;
		}
		if (((X >= x3) && (x4 >= X)) || ((X <= x3) && (x4 <= X)))	{
				xBetweenLine2 = true;
		}
		if (((Y >= y3) && (y4 >= Y)) || ((Y <= y3) && (y4 <= Y)))	{
				yBetweenLine2 = true;
		}
		return xBetweenLine1 && yBetweenLine1 && xBetweenLine2 && yBetweenLine2;
}

/*
 * C#
 */
/*
static bool IsCorssLine(double x1, double y1, double x2, double y2, double x3, double y3, double x4, double y4)
{
    //we assume the beeline as 
    //1: y = ax + b  (y1=ax1+b, y2=ax2+b)
    //2: y = mx + n  (y3=mx3+n, y4=mx4+n)
    double a, b, m, n;

    a = (y1 - y2) / (x1 - x2);
    b = y1 - a * x1;
    m = (y3 - y4) / (x3 - x4);
    n = y3 - m * x3;

    if (a == m) //means the two beelines are parallel
    {
        return false;
    }

    //now, let's get the corss point of the two lines
    double X, Y;
    X = (n - b) / (a - m);
    Y = a * X + b;

    //now, let's check whether (X,Y) is between (x1,y1) and (x2,y2), and between (x3,y3) and (x4,y4)
    bool xBetweenLine1 = false;
    bool yBetweenLine1 = false;
    bool xBetweenLine2 = false;
    bool yBetweenLine2 = false;
    if( ((X >= x1)&&(x2 >= X)) || ((X <= x1)&&(x2 <= X)) )
    {
        xBetweenLine1 = true;
    }
    if (((Y >= y1) && (y2 >= Y)) || ((Y <= y1) && (y2 <= Y)))
    {
        yBetweenLine1 = true;
    }
    if (((X >= x3) && (x4 >= X)) || ((X <= x3) && (x4 <= X)))
    {
        xBetweenLine2 = true;
    }
    if (((Y >= y3) && (y4 >= Y)) || ((Y <= y3) && (y4 <= Y)))
    {
        yBetweenLine2 = true;
    }

    return xBetweenLine1 && yBetweenLine1 && xBetweenLine2 && yBetweenLine2;
}*/



/*
/// <summary> 
/// Check whether the walking route cross with the exit--platform line, if so, refine it. 
/// </summary> 
/// <param name="route"></param> 
/// <param name="fromBusToSubway"></param> 
/// <param name="exit"></param> 
/// <param name="platform"></param> 
private static List<LatLong> TryGetNewRoute(Route route, bool fromBusToSubway, LatLong exit, LatLong platform) 
{ 
		LatLong[] segments = route.Path.Coordinates; 
		List<LatLong> newRoute = new List<LatLong>(); 

		double x1 = exit.Longitude; 
		double y1 = exit.Latitude; 
		double x2 = platform.Longitude; 
		double y2 = platform.Latitude; 
		double x3, y3, x4, y4; 

		int j = -1; 
		for (int i = 0; i < segments.Length - 1; i++) { 
				x3 = segments[i].Longitude; 
				y3 = segments[i].Latitude; 
				x4 = segments[i + 1].Longitude; 
				y4 = segments[i + 1].Latitude; 

				if(HelpFunction.IsCorssLine(x1,y1,x2,y2,x3,y3,x4,y4)){
						j = i;
						break; 
				} 
		} 

		if (j > -1) {
				double middleX = (segments[j].Longitude + segments[j + 1].Longitude) / 2; 
				double middleY = (segments[j].Latitude + segments[j + 1].Latitude) / 2; 

				if (fromBusToSubway) {
						for (int k = 0; k < j + 1; k++) 
						{ 
								newRoute.Add(segments[k]); 
						} 
						if (!HelpFunction.IsCorssLine(x1, y1, x2, y2, middleX, middleY, segments[j].Longitude, segments[j].Latitude)) 
						{ 
								newRoute.Add(new LatLong(middleY, middleX)); 
						} 
				} else {
						if (!HelpFunction.IsCorssLine(x1, y1, x2, y2, middleX, middleY, segments[j + 1].Longitude, segments[j + 1].Latitude)) {
								newRoute.Add(new LatLong(middleY, middleX)); 
						}
						for (int k = j + 1; k < segments.Length; k++) { 
								newRoute.Add(segments[k]); 
						} 
				}
				return newRoute; 
		}
		return null;
}
*/
