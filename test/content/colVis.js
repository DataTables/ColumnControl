describe('columnControl - colVis', function () {
	dt.libs({
		js: ['jquery', 'datatables', 'columncontrol'],
		css: ['datatables', 'columncontrol']
	});

	describe('Functionality', function () {
		let table;

		dt.html('basic');

		it('Is present', () => {
			expect(DataTable.ColumnControl.content.colVis).toBeDefined();
		});

		it('Create CC dropdown with colVis', () => {
			table = new DataTable('#example', {
				columnControl: [['colVis']]
			});

			expect($('.dtcc').length).toBe(6);
		});

		it('Six dropdowns were created', () => {
			expect($('.dtcc-button_dropdown').length).toBe(6);
		});

		it('No dropdown initially', () => {
			expect($('.dtcc-dropdown').length).toBe(0);
		});

		it('Shows dropdown when clicked', () => {
			$('.dtcc-button_dropdown')
				.eq(0)
				.trigger('click');

			expect($('.dtcc-dropdown').length).toBe(1);
		});

		it('Has a list in it', () => {
			expect($('.dtcc-dropdown div.dtcc-list').length).toBe(1);
		});

		it('Has six buttons', () => {
			expect($('.dtcc-dropdown .dtcc-button').length).toBe(6);
		});

		it('They are all active', () => {
			expect($('.dtcc-dropdown .dtcc-button.dtcc-button_active').length).toBe(6);
		});

		it('The text for each matches the column title', () => {
			let buttons = $('.dtcc-dropdown .dtcc-button');

			expect(buttons.eq(0).text()).toBe(table.column(0).title());
			expect(buttons.eq(1).text()).toBe(table.column(1).title());
			expect(buttons.eq(2).text()).toBe(table.column(2).title());
			expect(buttons.eq(3).text()).toBe(table.column(3).title());
			expect(buttons.eq(4).text()).toBe(table.column(4).title());
			expect(buttons.eq(5).text()).toBe(table.column(5).title());
		});

		it('Clicking Salary column will hide it', () => {
			$('.dtcc-dropdown .dtcc-button')
				.eq(5)
				.trigger('click');

			expect(table.column(5).visible()).toBe(false);
		});

		it('The others are still visible', () => {
			expect(table.column(0).visible()).toBe(true);
			expect(table.column(1).visible()).toBe(true);
			expect(table.column(2).visible()).toBe(true);
			expect(table.column(3).visible()).toBe(true);
			expect(table.column(4).visible()).toBe(true);
			expect($('thead th').length).toBe(5);
		});

		it('Dropdown is still visible', () => {
			expect($('.dtcc-dropdown').length).toBe(1);
		});

		it('Clicked button is no longer active', () => {
			expect(
				$('.dtcc-dropdown .dtcc-button')
					.eq(5)
					.hasClass('dtcc-button_active')
			).toBe(false);
		});

		it('Clicking the button again will show the column again', () => {
			$('.dtcc-dropdown .dtcc-button')
				.eq(5)
				.trigger('click');

			expect(table.column(5).visible()).toBe(true);
		});

		it('The others are still visible', () => {
			expect(table.column(0).visible()).toBe(true);
			expect(table.column(1).visible()).toBe(true);
			expect(table.column(2).visible()).toBe(true);
			expect(table.column(3).visible()).toBe(true);
			expect(table.column(4).visible()).toBe(true);
			expect($('thead th').length).toBe(6);
		});

		it('Dropdown is still visible', () => {
			expect($('.dtcc-dropdown').length).toBe(1);
		});

		it('Clicked button is again active', () => {
			expect(
				$('.dtcc-dropdown .dtcc-button')
					.eq(5)
					.hasClass('dtcc-button_active')
			).toBe(true);
		});

		it('Hiding multiple columns', () => {
			$('.dtcc-dropdown .dtcc-button')
				.eq(5)
				.trigger('click');

			$('.dtcc-dropdown .dtcc-button')
				.eq(4)
				.trigger('click');

			$('.dtcc-dropdown .dtcc-button')
				.eq(3)
				.trigger('click');

			expect($('thead th').length).toBe(3);
		});

		it('The expected columns were hidden', () => {
			expect(table.column(0).visible()).toBe(true);
			expect(table.column(1).visible()).toBe(true);
			expect(table.column(2).visible()).toBe(true);
			expect(table.column(3).visible()).toBe(false);
			expect(table.column(4).visible()).toBe(false);
			expect(table.column(5).visible()).toBe(false);
		});

		it('Just three active buttons', () => {
			expect($('.dtcc-dropdown .dtcc-button.dtcc-button_active').length).toBe(3);
		});

		it('Hide dropdown', () => {
			$('body').trigger('click');

			expect($('.dtcc-dropdown').length).toBe(0);
		});

		dt.html('basic');

		it('Hidden columns are not active', () => {
			table = new DataTable('#example', {
				columnControl: [['colVis']],
				columnDefs: [
					{
						targets: [3, 5],
						visible: false
					}
				]
			});

			$('.dtcc-button_dropdown')
				.eq(0)
				.trigger('click');

			expect($('thead th').length).toBe(4);
			expect($('.dtcc-dropdown').length).toBe(1);
		});

		it('Active state reflects the columns', () => {
			let buttons = $('.dtcc-dropdown .dtcc-button');

			expect(buttons.eq(0).hasClass('dtcc-button_active')).toBe(true);
			expect(buttons.eq(1).hasClass('dtcc-button_active')).toBe(true);
			expect(buttons.eq(2).hasClass('dtcc-button_active')).toBe(true);
			expect(buttons.eq(3).hasClass('dtcc-button_active')).toBe(false);
			expect(buttons.eq(4).hasClass('dtcc-button_active')).toBe(true);
			expect(buttons.eq(5).hasClass('dtcc-button_active')).toBe(false);
		});

		it('Clicking a button will show the column', () => {
			$('.dtcc-dropdown .dtcc-button')
				.eq(5)
				.trigger('click');

			expect(table.column(5).visible()).toBe(true);
		});
	});

	describe('Option - columns', function () {
		dt.html('basic');

		// Default of all columns was tested above

		it('Create CC dropdown with colVis and limited columns', () => {
			table = new DataTable('#example', {
				columnControl: [
					[
						{
							extend: 'colVis',
							columns: [2, 3, 4, 5]
						}
					]
				]
			});

			expect($('.dtcc').length).toBe(6);
		});

		it('Show dropdown', () => {
			$('.dtcc-button_dropdown')
				.eq(0)
				.trigger('click');

			expect($('.dtcc-dropdown').length).toBe(1);
		});

		it('Only four buttons in the dropdown', () => {
			expect($('.dtcc-dropdown .dtcc-button').length).toBe(4);
		});

		it('Titles match', () => {
			let buttons = $('.dtcc-dropdown .dtcc-button');

			expect(buttons.eq(0).text()).toBe(table.column(2).title());
			expect(buttons.eq(1).text()).toBe(table.column(3).title());
			expect(buttons.eq(2).text()).toBe(table.column(4).title());
			expect(buttons.eq(3).text()).toBe(table.column(5).title());
		});

		it('Buttons control the expected columns', () => {
			$('.dtcc-dropdown .dtcc-button')
				.eq(0)
				.trigger('click');

			expect(table.column(2).visible()).toBe(false);
		});
	});

	describe('Option - search', function () {
		dt.html('basic');

		it('Create CC dropdown with colVis (default search)', () => {
			table = new DataTable('#example', {
				columnControl: [['colVis']]
			});

			expect($('.dtcc').length).toBe(6);
		});

		it('Show dropdown', () => {
			$('.dtcc-button_dropdown')
				.eq(0)
				.trigger('click');

			expect($('.dtcc-dropdown').length).toBe(1);
		});

		it('No search input', () => {
			expect($('.dtcc-dropdown input').length).toBe(0);
		});

		dt.html('basic');

		it('Create CC dropdown with colVis (enable search)', () => {
			table = new DataTable('#example', {
				columnControl: [
					[
						{
							extend: 'colVis',
							search: true
						}
					]
				]
			});

			$('.dtcc-button_dropdown')
				.eq(0)
				.trigger('click');

			expect($('.dtcc-dropdown input').length).toBe(1);
		});

		it('Will search (case insensitive)', () => {
			$('.dtcc-dropdown input')
				.val('o')
				.triggerNative('input');

			expect($('.dtcc-dropdown .dtcc-button').length).toBe(2);
		});

		it('Titles are as expected', () => {
			let buttons = $('.dtcc-dropdown .dtcc-button');

			expect(buttons.eq(0).text()).toBe(table.column(1).title());
			expect(buttons.eq(1).text()).toBe(table.column(2).title());
		});

		it('And trigger visibility on the expected columns', () => {
			$('.dtcc-dropdown .dtcc-button')
				.eq(0)
				.trigger('click');

			expect(table.column(1).visible()).toBe(false);
			expect(table.column(2).visible()).toBe(true);
		});

		it('Can clear search', () => {
			$('.dtcc-dropdown input')
				.val('')
				.triggerNative('input');

			expect($('.dtcc-dropdown .dtcc-button').length).toBe(6);
		});
	});

	describe('Option - select', function () {
		dt.html('basic');

		it('Create CC dropdown with colVis (default select)', () => {
			table = new DataTable('#example', {
				columnControl: [['colVis']]
			});

			expect($('.dtcc').length).toBe(6);
		});

		it('Show dropdown', () => {
			$('.dtcc-button_dropdown')
				.eq(0)
				.trigger('click');

			expect($('.dtcc-dropdown').length).toBe(1);
		});

		it('No select buttons', () => {
			expect($('.dtcc-dropdown .dtcc-list-selectAll').length).toBe(0);
			expect($('.dtcc-dropdown .dtcc-list-selectNone').length).toBe(0);
		});

		dt.html('basic');

		it('Create CC dropdown with colVis (enable select)', () => {
			table = new DataTable('#example', {
				columnControl: [
					[
						{
							extend: 'colVis',
							select: true
						}
					]
				],
				columnDefs: [
					{
						target: 5,
						visible: false
					}
				]
			});

			$('.dtcc-button_dropdown')
				.eq(0)
				.trigger('click');

			expect($('.dtcc-dropdown .dtcc-list-selectAll').length).toBe(1);
		});

		it('Clicking select all shows all columns', () => {
			$('.dtcc-dropdown .dtcc-list-selectAll').trigger('click');

			expect($('thead th').length).toBe(6);
		});

		it('Clicking select none shows no columns', () => {
			$('.dtcc-dropdown .dtcc-list-selectNone').trigger('click');

			expect($('thead th').length).toBe(0);
		});

		it('And show all again', () => {
			$('.dtcc-dropdown .dtcc-list-selectAll').trigger('click');

			expect($('thead th').length).toBe(6);
		});

		it('Correct number shown in counter', () => {
			expect($('.dtcc-dropdown .dtcc-list-selectAll span').text()).toBe('(6)');
		});
	});

	describe('Option - title', function () {
		dt.html('basic');

		it('Create CC dropdown with colVis (default title)', () => {
			table = new DataTable('#example', {
				columnControl: [['colVis']]
			});

			expect($('.dtcc').length).toBe(6);
		});

		it('Show dropdown', () => {
			$('.dtcc-button_dropdown')
				.eq(0)
				.trigger('click');

			expect($('.dtcc-dropdown').length).toBe(1);
		});

		it('Got default title', () => {
			expect($('.dtcc-dropdown .dtcc-list-title').text()).toBe('Column visibility');
		});

		dt.html('basic');

		it('Setting with option', () => {
			table = new DataTable('#example', {
				columnControl: [
					[
						{
							extend: 'colVis',
							title: 'TestA'
						}
					]
				]
			});

			$('.dtcc-button_dropdown')
				.eq(0)
				.trigger('click');

			expect($('.dtcc-dropdown .dtcc-list-title').text()).toBe('TestA');
		});

		dt.html('basic');

		it('Setting with language option', () => {
			table = new DataTable('#example', {
				columnControl: [['colVis']],
				language: {
					columnControl: {
						colVis: 'TestB'
					}
				}
			});

			$('.dtcc-button_dropdown')
				.eq(0)
				.trigger('click');

			expect($('.dtcc-dropdown .dtcc-list-title').text()).toBe('TestB');
		});

		dt.html('basic');

		it('Set to be an empty string', () => {
			table = new DataTable('#example', {
				columnControl: [['colVis']],
				language: {
					columnControl: {
						colVis: ''
					}
				}
			});

			$('.dtcc-button_dropdown')
				.eq(0)
				.trigger('click');

			expect($('.dtcc-dropdown .dtcc-list-title').text()).toBe('');
		});
	});
});
