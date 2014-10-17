
_createDelegate = function(instance, method)
{
	return function() { return method.apply(instance, arguments); }
}

PageTurnFramework = function(control, canvas)
{
    this._control = control; // Reference to Silverlight control
    this._canvas = canvas;                      // Canvas containing pages
	
    this._index = 0;         // Current page index
    this._width = 0;         // Width of each page
    this._height = 0         // Height of each page
    this._count = 0;         // Number of even/odd page pairs
    this._turning = false;   // True if page turn in progress
    this._animating = false; // True if animated turn completion in progress
    this._percent = 0.0;     // Percent turned (0 = 0%, 1 = 100%)
    this._startPos = -1;     // X coordinate of initial mouse click
    this._direction = 0;     // -1 = Turning left, 1 = Turning right
    this._step = 0.05;       // Step size for animations
    this._shadowWidth = 16;  // Maximum shadow width
    this._shadowBreak = 5;   // Number of degrees required for shadow to attain maximum width
    this._owner = null;      // Owner of mouse capture
    
    // XAML references
    this._evens = new Array();                  // Even pages
    this._odds = new Array();                   // Odd pages
    this._shadow = null;                        // Polygon object used to draw shadow
    this._timer = null;                         // Storyboard timer for animations
    this._workingOdd = null;                    // Working right page
    this._workingEven = null;                   // Working left page
    this._oddClipRegion = null;                 // Geometries and transforms
    this._oddClipRegionLineSegment1 = null;
    this._oddClipRegionLineSegment2 = null;
    this._evenClipRegion = null;
    this._evenClipRegionLineSegment1 = null;
    this._evenClipRegionLineSegment2 = null;
    this._transformGroup = null;
    this._rotateTransform = null;
    this._translateTransform = null;
    
    // Event handler tokens
    this._beginLeftTurnTokens = new Array();
    this._continueLeftTurnTokens = new Array();
    this._endLeftTurnTokens = new Array();
    this._beginRightTurnTokens = new Array();
    this._continueRightTurnTokens = new Array();
    this._endRightTurnTokens = new Array();
    this._mouseLeaveToken = null;
    this._completedToken = null;
}

PageTurnFramework.prototype =
{
	///////////////////////////////////////////////////////////////////
	// Public methods

	addPage: function(left, right) 
	{
		this._beginRightTurnTokens.push(left.addEventListener('MouseLeftButtonDown', _createDelegate(this, this._onBeginRightTurn)));
		this._continueRightTurnTokens.push(left.addEventListener('MouseMove', _createDelegate(this, this._onContinueRightTurn)));
		this._endRightTurnTokens.push(left.addEventListener('MouseLeftButtonUp', _createDelegate(this, this._onEndRightTurn)));
		this._evens.push(left);
			
		this._beginLeftTurnTokens.push(right.addEventListener('MouseLeftButtonDown', _createDelegate(this, this._onBeginLeftTurn)));
		this._continueLeftTurnTokens.push(right.addEventListener('MouseMove', _createDelegate(this, this._onContinueLeftTurn)));
		this._endLeftTurnTokens.push(right.addEventListener('MouseLeftButtonUp', _createDelegate(this, this._onEndLeftTurn)));
		this._odds.push(right);
	},

	goToPage: function(index)
	{
		if (index > 0 && index < this._count)
		{
			this._index = index;
			this._initializeZOrder();
		}
	},

	getCurrentPageIndex: function()
	{
		return this._index;
	},

	getPageCount: function()
	{
		return this._count;
	},

	initializeFramework: function()
	{
		//////////////////////// XAML Templates ///////////////////////

		// XAML definition for clip region used on odd pages
		var _opg =
			'<PathGeometry>' +
				'<PathFigure StartPoint="0,0">' +
					'<LineSegment />' +
					'<LineSegment />' +
				'</PathFigure>' +
			'</PathGeometry>';

		// XAML definition for clip region used on even pages
		var _epg =
			'<PathGeometry>' +
				'<PathFigure StartPoint="0,0">' +
					'<LineSegment Point="0,{0}" />' +
					'<LineSegment />' +
					'<LineSegment />' +
				'</PathFigure>' +
			'</PathGeometry>';

		// XAML definition for transforms used on even pages
		var _tg =
			'<TransformGroup>' +
				'<RotateTransform />' +
				'<TranslateTransform />' +
			'</TransformGroup>';

		// XAML definition for Storyboard timer
		var _sb = '<Storyboard Name="3F8DC33C-F1AD-4108-B797-E4F914003C42" Duration="0:0:0.05" />';

		// XAML definition for shadow polygon
		var _poly = '<Polygon style="z-index:4; fill:black; opacity:0.2; visibility:collapse;" />';

		///////////////////////////////////////////////////////////////

		// Create a Storyboard for use as an animation timer
		this._timer = _control.content.createFromXaml(_sb);
		//this._canvas.resources.add(this._timer);
		this._completedToken = this._timer.addEventListener('Completed', _createDelegate(this, this._onTimerTick));
		//var MyInterval=setInterval("Refresh()",50);
		//clearInterval(MyInterval);

		// Register a handler for the root canvas's MouseLeave events
		this._mouseLeaveToken = this._canvas.addEventListener('MouseLeave', _createDelegate(this, this._onMouseLeftControl));

		// Create a PathGeometry for clipping odd pages
		this._oddClipRegion = this._control.content.createFromXaml(_opg);
		this._oddClipRegionLineSegment1 = this._oddClipRegion.figures.getItem(0).segments.getItem(0);
		this._oddClipRegionLineSegment2 = this._oddClipRegion.figures.getItem(0).segments.getItem(1);

		// Create a PathGeometry for clipping even pages
		var xaml = _epg.replace('{0}', this._evens[0].height);
		this._evenClipRegion = this._control.content.createFromXaml(xaml);
		this._evenClipRegionLineSegment1 = this._evenClipRegion.figures.getItem(0).segments.getItem(1);
		this._evenClipRegionLineSegment2 = this._evenClipRegion.figures.getItem(0).segments.getItem(2);

		// Create a TransformGroup for transforming even pages
		this._transformGroup = this._control.content.createFromXaml(_tg);
		this._rotateTransform = this._transformGroup.children.getItem(0);
		this._translateTransform = this._transformGroup.children.getItem(1);

		// Create a Polygon to provide shadow during page turns
		this._shadow = this._control.content.createFromXaml(_poly);
		this._odds[0].getParent().children.add(this._shadow);
		//TODO : replace shadow with
		
		
		
		// Initialize internal variables
		this._count = this._evens.length;
		this._width = this._evens[0].width;
		this._height = this._evens[0].height;
		
		// Initialize z-order
		this._initializeZOrder();
	},
    
	dispose: function()
	{
		// Deregister event handlers
		if (this._timer != null){
			this._timer.removeEventListener('Completed', this._completedToken);
		}
		if (this._mouseLeaveToken != null){
			this._canvas.removeEventListener('MouseLeave', this._mouseLeaveToken);
		}
		for (i=0; i<this._count; i++)
		{
			var left = this._evens.pop();
			left.removeEventListener('MouseLeftButtonDown', this._beginRightTurnTokens.pop());
			left.removeEventListener('MouseMove', this._continueRightTurnTokens.pop());
			left.removeEventListener('MouseLeftButtonUp', this._endRightTurnTokens.pop());

			var right = this._odds.pop();
			right.removeEventListener('MouseLeftButtonDown', this._beginLeftTurnTokens.pop());
			right.removeEventListener('MouseMove', this._continueLeftTurnTokens.pop());
			right.removeEventListener('MouseLeftButtonUp', this._endLeftTurnTokens.pop());
		}
	},

	///////////////////////////////////////////////////////////////////
	// Event handlers

	_onBeginLeftTurn: function(sender, args)
	{
		if (this._animating){
			return; // Do nothing if animation in progress
		}
		// Do nothing if trying to turn left but last
		// page is displayed
		if (this._index == this._count - 1){
			return;
		}
		// Start a left turn
		this._turning = true;
		this._direction = -1;
		this._owner = sender;
		this._percent = 0.0;
		this._startPos = args.getPosition(sender).x;
		sender.captureMouse();

		// Turn page to specified angle
		this._turnTo(this._percent);

		// Cache references to "working" pages
		this._workingOdd = this._odds[this._index];
		this._workingEven = this._evens[this._index + 1];

		// Assign clipping regions and transforms to relevant canvases
		this._workingOdd.clip = this._oddClipRegion;
		this._workingEven.clip = this._evenClipRegion;
		this._workingEven.renderTransform = this._transformGroup;

		// Set z-indexes for a left turn
		this._evens[this._index + 1].style.zIndex = 2;
		this._odds[this._index + 1].style.zIndex = 0;
	},

	_onContinueLeftTurn: function(sender, args)
	{
		if (this._animating){
			return; // Do nothing if animation in progress
		}
		if (this._turning){
			// Compute change in X
			var dx = this._startPos - args.getPosition(sender).x;

			// If mouse moved right, update _startPos so page
			// begins turning with first move left
			if (dx < 0){
				this._startPos = args.getPosition(sender).x;
				return;
			}

			// Compute turn percentage based on change in X
			var percent = dx / this._width;

			if (percent > 1.0){
				percent = 1.0;
			}else if (percent < 0.0){
				percent = 0.0;
			}
			// Exit now if no change
			if (percent == this._percent){
				return;
			}
			// Update percent turned
			this._percent = percent;

			// Turn page to specified angle
			this._turnTo(this._percent);
		}
	},

	_onEndLeftTurn: function(sender, args)
	{
		if (this._animating){
			return; // Do nothing if animation in progress
		}
		if (this._turning){
			this._completeTurn();
		}
	},

	_onBeginRightTurn: function(sender, args)
	{
		if (this._animating){
			return; // Do nothing if animation in progress
		}
		// Do nothing if trying to turn right but first
		// page is displayed
		if (this._index == 0){
			return;
		}
		// Start a right turn
		this._turning = true;
		this._direction = 1;
		this._owner = sender;
		this._percent = 1.0;
		this. _startPos = args.getPosition(sender).x;
		sender.captureMouse();

		// Turn page to specified angle
		this._turnTo(this._percent);

		// Cache references to "working" pages
		this._workingOdd = this._odds[this._index - 1];
		this._workingEven = this._evens[this._index];

		// Assign clipping regions and transforms to relevant canvases
		this._workingOdd.clip = this._oddClipRegion;
		this._workingEven.clip = this._evenClipRegion;
		this._workingEven.renderTransform = this._transformGroup;

		// Set z-indexes for a right turn
		this._evens[this._index].style.zIndex = 3;
		this._evens[this._index - 1].style.zIndex = 0;
		this._odds[this._index - 1].style.zIndex = 2;
	},

	_onContinueRightTurn: function(sender, args)
	{
		if (this._animating){
			return; // Do nothing if animation in progress
		}
		if (this._turning)
		{
			// Compute change in X
			var dx = args.getPosition(sender.getParent()).x - this._startPos;

			// If mouse moved left, update _startPos so page
			// begins turning with first move right
			if (dx < 0)
			{
				this._startPos = args.getPosition(sender.getParent()).x;
				return;
			}

			// Compute turn percentage based on change in X
			var percent = 1.0 - (dx / this._width);

			if (percent > 1.0){
				percent = 1.0;
			}else if (percent < 0.0){
				percent = 0.0;
			}
			// Exit now if no change
			if (percent == this._percent){
				return;
			}
			// Update percent turned
			this._percent = percent;

			// Turn page to specified angle
			this._turnTo(this._percent);
		}
	},

	_onEndRightTurn: function(sender, args)
	{
		if (this._animating){
			return; // Do nothing if animation in progress
		}
		if (this._turning){
			this._completeTurn();
		}
	},

	_onMouseLeftControl: function(sender)
	{
		if (this._animating){
			return; // Do nothing if animation in progress
		}
		if (this._turning){
			this._completeTurn();
		}
	},

	_onTimerTick: function(sender, args)
	{
		this._percent += this._step;

		if (this._percent < 0.0){
			this._percent = 0.0;
		}else if (this._percent > 1.0){
			this._percent = 1.0;
		}
		this._turnTo(this._percent);

		if (this._percent == 0.0)
		{
			if (this._direction == 1){
				this._index--;
			}
			this._reset();
		}
		else if (this._percent == 1.0)
		{
			if (this._direction == -1){
				this._index++;
			}
			this._reset();
		}else{
			this._timer.begin(); 
		}
	}, 
 
///////////////////////////////////////////////////////////////////
// Private methods

	_turnTo: function(percent)
	{
		// Compute angle of rotation
		var degrees = 45 - (percent * 45);
		var radians = degrees * Math.PI / 180;
		
		// Compute x coordinates along bottom of canvas
		var dx1 = this._width - (percent * this._width);
		var dx2 = this._width - dx1;

		// Compute tangent of rotation angle
		var tan = Math.tan(radians);

		// Configure odd clip region
		var p2y;
		if (tan == 0){
			p2y = this._height;
		}else{
			p2y = this._height + (dx1 / tan);
		}
		var p3x = p2y * tan;    

		this._oddClipRegionLineSegment1.point = '0,' + p2y;
		this._oddClipRegionLineSegment2.point = p3x + ',0';
		
		// Configure even clip region
		var p7x = dx2 - (this._height * tan);

		this._evenClipRegionLineSegment1.point = dx2 + ',' + this._height;
		this._evenClipRegionLineSegment2.point = p7x + ',0';
		
		// Apply clipping regions and transforms
		this._rotateTransform.centerX = dx2;
		this._rotateTransform.centerY = this._height;
		this._rotateTransform.angle = 2 * degrees;

		this._translateTransform.x = 2 * (this._width - dx2);

		// Configure shadow
		if (percent == 0.0 || percent == 1.0)
		{
			this._shadow.visibility = 'Collapsed';
			return;
		}

		this._shadow.visibility = 'Visible';

		var min = this._shadowBreak;
		var max = 45 - this._shadowBreak;
		var width;

		if (degrees > min && degrees < max){
			width = this._shadowWidth;
		}else{
			if (degrees <= min){
				width = (degrees / this._shadowBreak) * this._shadowWidth;
			}else{ // degrees >= max
				width = ((45 - degrees) / this._shadowBreak) * this._shadowWidth;
			}
		}

		var x1 = this._width + dx1 + (this._height * tan);
		var x2 = this._width + dx1;
		var y2 = this._height;
		var x3 = x2 + width;
		var y3 = this._height;
		var x4 = x1 + width;

		this._shadow.points = x1 + ',0' + ' ' + x2 + ',' + y2 + ' ' + x3 + ',' + y3 + ' ' + x4 + ',0';
	},

	_completeTurn: function()
	{
		if (this._percent == 0.0)
		{
			if (this._direction == 1){
				this._index--;
			}
			this._reset();
			return;
		}

		if (this._percent == 1.0)
		{
			if (this._direction == -1){
				this._index++;
			}
			this._reset();
			return;
		}

		if (this._percent < 0.5){
			this._step = -Math.abs(this._step);
		}else{
			this._step = Math.abs(this._step);
		}
		this._animating = true;
		this._timer.begin();
	},

	_reset: function()
	{
		this._turning = false;
		this._animating = false;
		this._direction = 0;
		
		if (this._owner != null){
			this._owner.releaseMouseCapture();
		}
		this._owner = null;
		if (this._workingOdd != null && this._workingOdd.clip != null){
			this._workingOdd.clip = null;
		}
		if (this._workingEven != null && this._workingEven.clip != null){
			this._workingEven.clip = null;
		}
		if (this._workingEven != null && this._workingEven.renderTransform != null){
			this._workingEven.renderTransform = null;
		}

		this._workingOdd = null;
		this._workingEven = null;

		this._shadow.visibility = 'Collapsed';

		this._initializeZOrder();
	},

	_initializeZOrder: function()
	{
		for (i=0; i<this._count; i++){
			this._evens[i].style.zIndex = this._odds[i].style.zIndex = (i == this._index) ? 1 : -1;
		}
	}
}