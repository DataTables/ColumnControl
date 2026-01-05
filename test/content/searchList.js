describe('columnControl - searchList', function () {
	dt.libs({
		js: ['jquery', 'datatables', 'columncontrol'],
		css: ['datatables', 'columncontrol']
	});

	describe('Functionality', function () {
		let table;

		dt.html('basic');

		it('Is present', () => {
			expect(DataTable.ColumnControl.content.searchList).toBeDefined();
		});

		it('Create CC with search', () => {
			table = new DataTable('#example', {
				columnControl: [['searchList']],
				ordering: {
					handler: false
				}
			});

			expect($('.dtcc-button_dropdown').length).toBe(6);
		});

		it('Shows dropdown when clicked', () => {
			$('.dtcc-button_dropdown')
				.eq(0)
				.trigger('click');

			expect($('.dtcc-dropdown').length).toBe(1);
		});

		it('Has a search list in it', () => {
			expect($('div.dtcc-list').length).toBe(1);
		});

		it('There is a button for each search term', () => {
			expect($('div.dtcc-list button.dtcc-button').length).toBe(57);
		});

		it('None of them are active by default', () => {
			expect($('div.dtcc-list button.dtcc-button.dtcc-button_active').length).toBe(0);
		});

		it('The text for the buttons matches the options', () => {
			expect($('div.dtcc-list button.dtcc-button:eq(0)').text()).toBe('Airi Satou');
			expect($('div.dtcc-list button.dtcc-button:eq(1)').text()).toBe('Angelica Ramos');
			expect($('div.dtcc-list button.dtcc-button:eq(2)').text()).toBe('Ashton Cox');
		});

		it('Clicking a button filters the table', () => {
			$('div.dtcc-list button.dtcc-button:eq(1)').trigger('click');

			expect($('tbody td:eq(0)').text()).toBe('Angelica Ramos');
			expect($('tbody tr').length).toBe(1);
		});

		it('The button is active', () => {
			expect($('div.dtcc-list button.dtcc-button:eq(1)').hasClass('dtcc-button_active')).toBe(
				true
			);
		});

		it('Only that button', () => {
			expect($('div.dtcc-list button.dtcc-button.dtcc-button_active').length).toBe(1);
		});

		it('The dropdown button becomes active', () => {
			expect($('button.dtcc-button_dropdown.dtcc-button_active').length).toBe(1);
		});

		it('Selecting a second button is a combination filter', () => {
			$('div.dtcc-list button.dtcc-button:eq(6)').trigger('click');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Angelica Ramos');
			expect($('tbody tr:eq(1) td:eq(0)').text()).toBe('Bruno Nash');
			expect($('tbody tr').length).toBe(2);
		});

		it('Those buttons are active', () => {
			expect($('div.dtcc-list button.dtcc-button:eq(1)').hasClass('dtcc-button_active')).toBe(
				true
			);
			expect($('div.dtcc-list button.dtcc-button:eq(6)').hasClass('dtcc-button_active')).toBe(
				true
			);
		});

		it('And only those two', () => {
			expect($('div.dtcc-list button.dtcc-button.dtcc-button_active').length).toBe(2);
		});

		it('Clicking a button again toggles it off', () => {
			$('div.dtcc-list button.dtcc-button:eq(1)').trigger('click');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Bruno Nash');
			expect($('tbody tr').length).toBe(1);
		});

		it('That button removed the active class', () => {
			expect($('div.dtcc-list button.dtcc-button:eq(1)').hasClass('dtcc-button_active')).toBe(
				false
			);
		});

		it('There is still one which is active', () => {
			expect($('div.dtcc-list button.dtcc-button.dtcc-button_active').length).toBe(1);
		});

		it('Clicking the other button toggles it off as well - no filter remaining', () => {
			$('div.dtcc-list button.dtcc-button:eq(6)').trigger('click');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
			expect($('tbody tr').length).toBe(10);
		});

		it('The dropdown button becomes non-active', () => {
			expect($('button.dtcc-button_dropdown.dtcc-button_active').length).toBe(0);
		});

		it('No active buttons', () => {
			expect($('div.dtcc-list button.dtcc-button.dtcc-button_active').length).toBe(0);
		});

		it('Clicking on the body closes the dropdown', () => {
			$('body').trigger('click');

			expect($('.dtcc-dropdown').length).toBe(0);
		});

		it('Click dropdown with common values', () => {
			$('.dtcc-button_dropdown')
				.eq(2)
				.trigger('click');

			expect($('.dtcc-dropdown').length).toBe(1);
		});

		it('Search terms are grouped', () => {
			expect($('div.dtcc-list button.dtcc-button').length).toBe(7);
		});

		it('None of them are active by default', () => {
			expect($('div.dtcc-list button.dtcc-button.dtcc-button_active').length).toBe(0);
		});

		it('The text for the buttons matches the options and is ordered', () => {
			expect($('div.dtcc-list button.dtcc-button:eq(0)').text()).toBe('Edinburgh');
			expect($('div.dtcc-list button.dtcc-button:eq(1)').text()).toBe('London');
			expect($('div.dtcc-list button.dtcc-button:eq(2)').text()).toBe('New York');
		});

		it('Clicking an option with multiple matches showing them all in the table', () => {
			$('div.dtcc-list button.dtcc-button:eq(0)').trigger('click');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Cedric Kelly');
			expect($('tbody tr').length).toBe(9);
		});

		it('Clicking it again toggles it off', () => {
			$('div.dtcc-list button.dtcc-button:eq(0)').trigger('click');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
			expect($('tbody tr').length).toBe(10);
		});

		it('Clicking two options combines them', () => {
			$('div.dtcc-list button.dtcc-button:eq(0)').trigger('click');
			$('div.dtcc-list button.dtcc-button:eq(1)').trigger('click');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Angelica Ramos');
			expect($('tbody tr:eq(3) td:eq(0)').text()).toBe('Cedric Kelly');
			expect($('tbody tr').length).toBe(10);
		});

		it('Clicking on the body closes the dropdown', () => {
			$('body').trigger('click');

			expect($('.dtcc-dropdown').length).toBe(0);
		});

		it('Pick another column filter', () => {
			$('.dtcc-button_dropdown')
				.eq(1)
				.trigger('click');

			expect($('.dtcc-dropdown').length).toBe(1);
		});

		it('Combined filter over two columns', () => {
			$('div.dtcc-list button.dtcc-button:eq(7)').trigger('click');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Gavin Joyce');
			expect($('tbody tr:eq(1) td:eq(0)').text()).toBe('Suki Burks');
			expect($('tbody tr').length).toBe(2);
		});

		it('Two active dropdown buttons', () => {
			expect($('button.dtcc-button_dropdown.dtcc-button_active').length).toBe(2);
		});

		it('Clicking again removes the search for this column only', () => {
			$('div.dtcc-list button.dtcc-button:eq(7)').trigger('click');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Angelica Ramos');
			expect($('tbody tr:eq(3) td:eq(0)').text()).toBe('Cedric Kelly');
			expect($('tbody tr').length).toBe(10);
		});
	});

	describe('State saving', function () {
		let table;

		dt.html('basic');

		it('Create CC with searchList and stateSave', () => {
			// Clean out any old states
			localStorage.clear();

			table = new DataTable('#example', {
				columnControl: [['searchList']],
				ordering: {
					handler: false
				},
				stateSave: true
			});

			expect($('.dtcc-button_dropdown').length).toBe(6);
		});

		it('Show column filter', () => {
			$('.dtcc-button_dropdown')
				.eq(2)
				.trigger('click');

			expect($('.dtcc-dropdown').length).toBe(1);
		});

		it('Deselect count is empty', () => {
			expect($('button.dtcc-list-selectNone span').text()).toBe('');
		});

		it('Select an option', () => {
			$('div.dtcc-list button.dtcc-button:eq(1)').trigger('click');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Angelica Ramos');
		});

		it('Dropdown is active', () => {
			expect($('button.dtcc-button_dropdown:eq(2)').hasClass('dtcc-button_active')).toBe(
				true
			);
		});

		it('Deselect count is set', () => {
			expect($('button.dtcc-list-selectNone span').text()).toBe('(1)');
		});

		dt.html('basic');

		it('Reload the table', () => {
			table = new DataTable('#example', {
				columnControl: [['searchList']],
				ordering: {
					handler: false
				},
				stateSave: true
			});

			expect($('.dtcc-button_dropdown').length).toBe(6);
		});

		it('Filter is active', () => {
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Angelica Ramos');
		});

		it('Dropdown is still active', () => {
			expect($('button.dtcc-button_dropdown:eq(2)').hasClass('dtcc-button_active')).toBe(
				true
			);
		});

		it('Show column filter', () => {
			$('.dtcc-button_dropdown')
				.eq(2)
				.trigger('click');

			expect($('.dtcc-dropdown').length).toBe(1);
		});

		it('Correct filter button is active', () => {
			expect($('div.dtcc-list button.dtcc-button:eq(1)').hasClass('dtcc-button_active')).toBe(
				true
			);
			expect($('div.dtcc-list button.dtcc-button.dtcc-button_active').length).toBe(1);
		});

		it('Deselect count is up to date', () => {
			expect($('button.dtcc-list-selectNone span').text()).toBe('(1)');
		});

		it('Select another option', () => {
			$('div.dtcc-list button.dtcc-button:eq(6)').trigger('click');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});

		dt.html('basic');

		it('Reload the table', () => {
			table = new DataTable('#example', {
				columnControl: [['searchList']],
				ordering: {
					handler: false
				},
				stateSave: true
			});

			expect($('.dtcc-button_dropdown').length).toBe(6);
		});

		it('Filter is active', () => {
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
			expect($('tbody tr:eq(9) td:eq(0)').text()).toBe('Michael Silva');
		});

		it('Dropdown is still active', () => {
			expect($('button.dtcc-button_dropdown:eq(2)').hasClass('dtcc-button_active')).toBe(
				true
			);
		});

		it('Show column filter', () => {
			$('.dtcc-button_dropdown')
				.eq(2)
				.trigger('click');

			expect($('.dtcc-dropdown').length).toBe(1);
		});

		it('Correct filter buttons are active', () => {
			expect($('div.dtcc-list button.dtcc-button:eq(1)').hasClass('dtcc-button_active')).toBe(
				true
			);
			expect($('div.dtcc-list button.dtcc-button:eq(6)').hasClass('dtcc-button_active')).toBe(
				true
			);
			expect($('div.dtcc-list button.dtcc-button.dtcc-button_active').length).toBe(2);
		});

		it('Deselect count is still set', () => {
			expect($('button.dtcc-list-selectNone span').text()).toBe('(2)');
		});

		dt.html('basic');

		it('Reload again without changes', () => {
			table = new DataTable('#example', {
				columnControl: [['searchList']],
				ordering: {
					handler: false
				},
				stateSave: true
			});

			expect($('.dtcc-button_dropdown').length).toBe(6);
		});

		it('Filter is active after reload with no changes', () => {
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
			expect($('tbody tr:eq(9) td:eq(0)').text()).toBe('Michael Silva');
		});

		it('Show column filter', () => {
			$('.dtcc-button_dropdown')
				.eq(2)
				.trigger('click');

			expect($('.dtcc-dropdown').length).toBe(1);
		});

		it('Correct filter buttons are active', () => {
			expect($('div.dtcc-list button.dtcc-button:eq(1)').hasClass('dtcc-button_active')).toBe(
				true
			);
			expect($('div.dtcc-list button.dtcc-button:eq(6)').hasClass('dtcc-button_active')).toBe(
				true
			);
			expect($('div.dtcc-list button.dtcc-button.dtcc-button_active').length).toBe(2);
		});

		it('Deselect count is still set', () => {
			expect($('button.dtcc-list-selectNone span').text()).toBe('(2)');
		});

		it('Remove filter', () => {
			$('div.dtcc-list button.dtcc-button:eq(1)').trigger('click');
			$('div.dtcc-list button.dtcc-button:eq(6)').trigger('click');

			expect(table.page.info().recordsDisplay).toBe(57);
		});

		dt.html('empty');

		it('Ajax table and client-side options', (done) => {
			table = new DataTable('#example', {
				ajax: '/base/test/data/data.txt',
				columnControl: [
					[
						{
							extend: 'searchList',
							ajaxOnly: false
						}
					]
				],
				columns: [
					{ data: 'name' },
					{ data: 'position' },
					{
						data: 'office',
						columnControl: [[{
						   extend: "searchList",
						   options: [
								{ label: 'Tokyo', value: 'Tokyo'},
								{ label: 'London', value: 'London'},
								{ label: 'San Francisco', value: 'San Francisco'}
						   ]
						}]]
					},
					{ data: 'age' },
					{ data: 'start_date' },
					{ data: 'salary' }
				],
				ordering: {
					indicators: false,
					handler: false
				},
				stateSave: true
			});

			table.ready(() => {
				done();
			});
		});

		it('Show column filter', () => {
			$('.dtcc-button_dropdown')
				.eq(2)
				.trigger('click');

			expect($('.dtcc-dropdown').length).toBe(1);
		});

		it('Only three options from the defined list', () => {
			expect($('div.dtcc-list button.dtcc-button').length).toBe(3);
		});

		it('None of them are active by default', () => {
			expect($('div.dtcc-list button.dtcc-button.dtcc-button_active').length).toBe(0);
		});

		it('Clicking one will filter the table', () => {
			$('div.dtcc-list button.dtcc-button:eq(1)').trigger('click');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Angelica Ramos');
			expect($('tbody tr').length).toBe(10);
		});

		dt.html('empty');

		it('Reload the table with the same configuration', (done) => {
			table = new DataTable('#example', {
				ajax: '/base/test/data/data.txt',
				columnControl: [
					[
						{
							extend: 'searchList',
							ajaxOnly: false
						}
					]
				],
				columns: [
					{ data: 'name' },
					{ data: 'position' },
					{
						data: 'office',
						columnControl: [[{
						   extend: "searchList",
						   options: [
								{ label: 'Tokyo', value: 'Tokyo'},
								{ label: 'London', value: 'London'},
								{ label: 'San Francisco', value: 'San Francisco'}
						   ]
						}]]
					},
					{ data: 'age' },
					{ data: 'start_date' },
					{ data: 'salary' }
				],
				ordering: {
					indicators: false,
					handler: false
				},
				stateSave: true
			});

			table.ready(() => {
				done();
			});
		});

		it('The table has the filter applied', () => {
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Angelica Ramos');
			expect($('tbody tr').length).toBe(10);
		});

		it('The dropdown icon is active', () => {
			expect(
				$('.dtcc-button_dropdown').eq(2).hasClass('dtcc-button_active')
			).toBe(true);
		});

		it('Show column filter', () => {
			$('.dtcc-button_dropdown')
				.eq(2)
				.trigger('click');

			expect($('.dtcc-dropdown').length).toBe(1);
		});

		it('Only three options from the defined list', () => {
			expect($('div.dtcc-list button.dtcc-button').length).toBe(3);
		});

		it('The state loaded one is active', () => {
			expect($('div.dtcc-list button.dtcc-button:eq(1)').hasClass('dtcc-button_active')).toBe(true);
			expect($('div.dtcc-list button.dtcc-button.dtcc-button_active').length).toBe(1);
		});

		it('Clicking one will de-filter the table', () => {
			$('div.dtcc-list button.dtcc-button:eq(1)').trigger('click');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});
	});

	describe('Option - ajaxOnly', function () {
		let table;

		dt.html('empty');

		it('Create Ajax table with CC search', (done) => {
			table = new DataTable('#example', {
				ajax: '/base/test/data/cc-options.txt',
				columnControl: [['searchList']],
				columns: [
					{ data: 'name' },
					{ data: 'position' },
					{ data: 'office' },
					{ data: 'extn' },
					{ data: 'start_date' },
					{ data: 'salary' }
				],
				ordering: {
					indicators: false,
					handler: false
				}
			});

			table.ready(() => {
				done();
			});
		});

		it('Has only two visible dropdowns', () => {
			expect($('.dtcc-button_dropdown:visible').length).toBe(2);
		});

		it('Is in the expected column headers', () => {
			expect($('thead th:eq(0) .dtcc-button_dropdown:visible').length).toBe(0);
			expect($('thead th:eq(1) .dtcc-button_dropdown:visible').length).toBe(1);
			expect($('thead th:eq(2) .dtcc-button_dropdown:visible').length).toBe(1);
		});

		it('Shows dropdown when clicked (column index 1)', () => {
			$('.dtcc-button_dropdown')
				.eq(1)
				.trigger('click');

			expect($('.dtcc-dropdown').length).toBe(1);
		});

		it('Has a search list in it', () => {
			expect($('div.dtcc-list').length).toBe(1);
		});

		it('There is a button for each search term', () => {
			expect($('div.dtcc-list button.dtcc-button').length).toBe(33);
		});

		it('None of them are active by default', () => {
			expect($('div.dtcc-list button.dtcc-button.dtcc-button_active').length).toBe(0);
		});

		it('The text for the buttons matches the options', () => {
			expect($('div.dtcc-list button.dtcc-button:eq(0)').text()).toBe('Accountant');
			expect($('div.dtcc-list button.dtcc-button:eq(1)').text()).toBe(
				'Chief Executive Officer (CEO)'
			);
			expect($('div.dtcc-list button.dtcc-button:eq(2)').text()).toBe(
				'Chief Financial Officer (CFO)'
			);
		});

		it('Clicking will filter the table', () => {
			$('div.dtcc-list button.dtcc-button:eq(0)').trigger('click');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
			expect($('tbody tr').length).toBe(2);
		});

		dt.html('empty');

		it('Create Ajax table with CC search', (done) => {
			table = new DataTable('#example', {
				ajax: '/base/test/data/cc-options.txt',
				columnControl: [
					[
						{
							extend: 'searchList',
							ajaxOnly: false
						}
					]
				],
				columns: [
					{ data: 'name' },
					{ data: 'position' },
					{ data: 'office' },
					{ data: 'extn' },
					{ data: 'start_date' },
					{ data: 'salary' }
				],
				ordering: {
					indicators: false,
					handler: false
				}
			});

			table.ready(() => {
				done();
			});
		});

		it('Six dropdowns', () => {
			expect($('.dtcc-button_dropdown:visible').length).toBe(6);
		});

		it('Is in the expected column headers', () => {
			expect($('thead th:eq(0) .dtcc-button_dropdown').length).toBe(1);
			expect($('thead th:eq(1) .dtcc-button_dropdown').length).toBe(1);
			expect($('thead th:eq(2) .dtcc-button_dropdown').length).toBe(1);
		});

		it('Client-side dropdown has options it has collected', () => {
			$('.dtcc-button_dropdown')
				.eq(0)
				.trigger('click');

			expect($('div.dtcc-list button.dtcc-button:eq(0)').text()).toBe('Airi Satou');
			expect($('div.dtcc-list button.dtcc-button:eq(1)').text()).toBe('Angelica Ramos');
			expect($('div.dtcc-list button.dtcc-button:eq(2)').text()).toBe('Ashton Cox');
		});

		it('Client-side dropdown has the correct number of options', () => {
			expect($('div.dtcc-list button.dtcc-button').length).toBe(57);

			$('body').trigger('click');
		});

		it('Ajax options column has options from Ajax', () => {
			$('.dtcc-button_dropdown')
				.eq(1)
				.trigger('click');

			expect($('div.dtcc-list button.dtcc-button:eq(0)').text()).toBe('Accountant');
			expect($('div.dtcc-list button.dtcc-button:eq(1)').text()).toBe(
				'Chief Executive Officer (CEO)'
			);
			expect($('div.dtcc-list button.dtcc-button:eq(2)').text()).toBe(
				'Chief Financial Officer (CFO)'
			);
		});

		it('Ajax dropdown has the correct number of options', () => {
			expect($('div.dtcc-list button.dtcc-button').length).toBe(33);

			$('body').trigger('click');
		});
	});

	describe('Option - options', function () {
		// Default of options being generated automatically is tested above. Just testing
		// using given options here
		dt.html('basic');

		it('Create CC with search', () => {
			table = new DataTable('#example', {
				columnControl: [
					[
						{
							extend: 'searchList',
							options: ['2', '1', 'Airi Satou']
						}
					]
				],
				ordering: {
					handler: false
				}
			});

			expect($('.dtcc-button_dropdown').length).toBe(6);
		});

		it('List as the given options in it - in given order', () => {
			$('.dtcc-button_dropdown')
				.eq(0)
				.trigger('click');

			expect($('div.dtcc-list button.dtcc-button:eq(0)').text()).toBe('2');
			expect($('div.dtcc-list button.dtcc-button:eq(1)').text()).toBe('1');
			expect($('div.dtcc-list button.dtcc-button:eq(2)').text()).toBe('Airi Satou');
		});

		it('List has only the given options', () => {
			expect($('div.dtcc-list button.dtcc-button').length).toBe(3);
		});

		it('Clicking a button with no matching options, results in an empty table', () => {
			$('div.dtcc-list button.dtcc-button:eq(0)').trigger('click');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('No matching records found');
		});

		it('Adding a button with one which does match', () => {
			$('div.dtcc-list button.dtcc-button:eq(2)').trigger('click');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
			expect($('tbody tr').length).toBe(1);
		});

		dt.html('basic');

		it('Create CC with search and option objects', () => {
			table = new DataTable('#example', {
				columnControl: [
					[
						{
							extend: 'searchList',
							options: [
								{ label: 'First', value: 'Bruno Nash' },
								{ label: 'Cara Stevens', value: 'Nothing' }
							]
						}
					]
				],
				ordering: {
					handler: false
				}
			});

			expect($('.dtcc-button_dropdown').length).toBe(6);
		});

		it('List as the given options in it - in given order', () => {
			$('.dtcc-button_dropdown')
				.eq(0)
				.trigger('click');

			expect($('div.dtcc-list button.dtcc-button:eq(0)').text()).toBe('First');
			expect($('div.dtcc-list button.dtcc-button:eq(1)').text()).toBe('Cara Stevens');
		});

		it('List has only the given options', () => {
			expect($('div.dtcc-list button.dtcc-button').length).toBe(2);
		});

		it('Clicking a button uses the value for the search string, not the label - A', () => {
			$('div.dtcc-list button.dtcc-button:eq(1)').trigger('click');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('No matching records found');
		});

		it('Clicking a button uses the value for the search string, not the label - B', () => {
			$('div.dtcc-list button.dtcc-button:eq(0)').trigger('click');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Bruno Nash');
			expect($('tbody tr').length).toBe(1);
		});
	});

	describe('Option - orthogonal', function () {
		// Default of `display` is implicitly tested above, so this dives into the option being used
		dt.html('basic');

		it('Create CC with search', () => {
			table = new DataTable('#example', {
				columnControl: [
					[
						{
							extend: 'searchList',
							orthogonal: 'cc'
						}
					]
				],
				ordering: {
					handler: false
				},
				columnDefs: [
					{
						target: 2,
						render: function (data, type, row) {
							if (type === 'cc') {
								return data + '-A';
							}

							return data;
						}
					}
				]
			});

			expect($('.dtcc-button_dropdown').length).toBe(6);
		});

		it('Displayed values are from the orthogonal return type', () => {
			$('.dtcc-button_dropdown')
				.eq(2)
				.trigger('click');

			expect($('div.dtcc-list button.dtcc-button:eq(0)').text()).toBe('Edinburgh-A');
			expect($('div.dtcc-list button.dtcc-button:eq(1)').text()).toBe('London-A');
			expect($('div.dtcc-list button.dtcc-button:eq(2)').text()).toBe('New York-A');
		});

		it('Clicking a button will still match', () => {
			$('div.dtcc-list button.dtcc-button:eq(0)').trigger('click');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Cedric Kelly');
		});
	});

	describe('Option - search', function () {
		dt.html('basic');

		it('Create CC dropdown with searchList (default search)', () => {
			table = new DataTable('#example', {
				columnControl: [['searchList']]
			});

			expect($('.dtcc').length).toBe(6);
		});

		it('Show dropdown', () => {
			$('.dtcc-button_dropdown')
				.eq(0)
				.trigger('click');

			expect($('.dtcc-dropdown').length).toBe(1);
		});

		it('Has a search input', () => {
			expect($('.dtcc-dropdown input').length).toBe(1);
		});

		it('Will search (case insensitive)', () => {
			$('.dtcc-dropdown input')
				.val('z')
				.triggerNative('input');

			expect($('.dtcc-dropdown .dtcc-button').length).toBe(4);
		});

		it('Titles are as expected', () => {
			let buttons = $('.dtcc-dropdown .dtcc-button');

			expect(buttons.eq(0).text()).toBe('Gavin Cortez');
			expect(buttons.eq(1).text()).toBe('Tatyana Fitzpatrick');
		});

		it('And trigger search', () => {
			$('.dtcc-dropdown .dtcc-button')
				.eq(0)
				.trigger('click');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Gavin Cortez');
		});

		it('Can clear search', () => {
			$('.dtcc-dropdown input')
				.val('')
				.triggerNative('input');

			expect($('.dtcc-dropdown .dtcc-button').length).toBe(57);
		});

		dt.html('basic');

		it('Create CC dropdown with searchList (disable search)', () => {
			table = new DataTable('#example', {
				columnControl: [
					[
						{
							extend: 'searchList',
							search: false
						}
					]
				]
			});

			$('.dtcc-button_dropdown')
				.eq(0)
				.trigger('click');

			expect($('.dtcc-dropdown input').length).toBe(0);
		});
	});

	describe('Option - select', function () {
		dt.html('basic');

		it('Create CC dropdown with searchList (default select)', () => {
			table = new DataTable('#example', {
				columnControl: [['searchList']]
			});

			expect($('.dtcc').length).toBe(6);
		});

		it('Show dropdown', () => {
			$('.dtcc-button_dropdown')
				.eq(0)
				.trigger('click');

			expect($('.dtcc-dropdown').length).toBe(1);
		});

		it('Has select buttons', () => {
			expect($('.dtcc-dropdown .dtcc-list-selectAll').length).toBe(1);
			expect($('.dtcc-dropdown .dtcc-list-selectNone').length).toBe(1);
		});

		it('Clicking select all shows all rows', () => {
			$('.dtcc-dropdown .dtcc-list-selectAll').trigger('click');

			expect(table.page.info().recordsDisplay).toBe(57);
		});

		it('Active class is added to all', () => {
			expect($('div.dtcc-list button.dtcc-button.dtcc-button_active').length).toBe(57);
		});

		it('Clicking select none also shows all rows (no filter)', () => {
			$('.dtcc-dropdown .dtcc-list-selectNone').trigger('click');

			expect(table.page.info().recordsDisplay).toBe(57);
		});

		it('Active class is removed', () => {
			expect($('div.dtcc-list button.dtcc-button.dtcc-button_active').length).toBe(0);
		});

		it('Select a single filter', () => {
			$('div.dtcc-list button.dtcc-button:eq(1)').trigger('click');

			expect($('tbody td:eq(0)').text()).toBe('Angelica Ramos');
			expect($('tbody tr').length).toBe(1);
		});

		it('Clicking select none deselects', () => {
			$('.dtcc-dropdown .dtcc-list-selectNone').trigger('click');

			expect(table.page.info().recordsDisplay).toBe(57);
		});

		it('Active class is removed', () => {
			expect($('div.dtcc-list button.dtcc-button.dtcc-button_active').length).toBe(0);
		});

		it('Correct number shown in counter', () => {
			expect($('.dtcc-dropdown .dtcc-list-selectAll span').text()).toBe('(57)');
		});

		dt.html('basic');

		it('Create CC dropdown with searchList (disable select)', () => {
			table = new DataTable('#example', {
				columnControl: [
					[
						{
							extend: 'searchList',
							select: false
						}
					]
				]
			});

			$('.dtcc-button_dropdown')
				.eq(0)
				.trigger('click');

			expect($('.dtcc-dropdown .dtcc-list-selectAll').length).toBe(0);
			expect($('.dtcc-dropdown .dtcc-list-selectNone').length).toBe(0);
		});
	});

	describe('Option - title', function () {
		dt.html('basic');

		it('Create CC dropdown with searchList (default title)', () => {
			table = new DataTable('#example', {
				columnControl: [['searchList']]
			});

			expect($('.dtcc').length).toBe(6);
		});

		it('Show dropdown', () => {
			$('.dtcc-button_dropdown')
				.eq(0)
				.trigger('click');

			expect($('.dtcc-dropdown').length).toBe(1);
		});

		it('Got default title - is empty', () => {
			expect($('.dtcc-dropdown .dtcc-list-title').text()).toBe('');
		});

		dt.html('basic');

		it('Setting with option', () => {
			table = new DataTable('#example', {
				columnControl: [
					[
						{
							extend: 'searchList',
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
				columnControl: [['searchList']],
				language: {
					columnControl: {
						searchList: 'TestB'
					}
				}
			});

			$('.dtcc-button_dropdown')
				.eq(0)
				.trigger('click');

			expect($('.dtcc-dropdown .dtcc-list-title').text()).toBe('TestB');
		});

		dt.html('basic');

		it('Set with the column name (title replacement)', () => {
			table = new DataTable('#example', {
				columnControl: [['searchList']],
				language: {
					columnControl: {
						searchList: 'TestC [title] TestD'
					}
				}
			});

			$('.dtcc-button_dropdown')
				.eq(0)
				.trigger('click');

			expect($('.dtcc-dropdown .dtcc-list-title').text()).toBe('TestC Name TestD');
		});
	});

	describe('Option - hidable', function () {
		let table;

		dt.html('empty');

		it('Create Ajax table with CC searchList', (done) => {
			$('#example thead th:gt(1)').remove();
			$('#example tfoot th:gt(1)').remove();

			var data1 = {
				data: [
					{ A: '1,1', B: '1,2' },
					{ A: '2,1', B: '2,2' }
				],
				columnControl: {
					A: ['1,1', '1,2', '1,3']
				}
			};

			var data2 = {
				data: [
					{ A: '5,1', B: '5,2' },
					{ A: '6,1', B: '6,2' },
					{ A: '7,1', B: '7,2' },
					{ A: '8,1', B: '8,2' }
				],
				columnControl: {}
			};

			var loaded1 = false;

			table = new DataTable('#example', {
				ajax: function (data, cb) {
					if (loaded1) {
						cb(data2);
					}
					else {
						loaded1 = true;
						cb(data1);
					}
				},
				columnControl: [
					[
						{
							extend: 'searchList',
							ajaxOnly: true
						}
					]
				],
				columns: [{ data: 'A' }, { data: 'B' }],
				initComplete: () => {
					done();
				}
			});
		});

		it('Check that a list is present for first column', () => {
			expect($('thead th:eq(0) .dtcc-button_dropdown:visible').length).toBe(1);
		});

		it('Shows dropdown when clicked', () => {
			$('.dtcc-button_dropdown')
				.eq(0)
				.trigger('click');

			expect($('.dtcc-dropdown').length).toBe(1);
		});

		it('Has a search list in it', () => {
			expect($('div.dtcc-list').length).toBe(1);
		});

		it('There is a button for the defined search terms', () => {
			expect($('div.dtcc-list button.dtcc-button').length).toBe(3);
		});

		it('Clicking on the body closes the dropdown', () => {
			$('body').trigger('click');

			expect($('.dtcc-dropdown').length).toBe(0);
		});

		it('Hides when reloaded and no options provided', (done) => {
			table.ajax.reload(() => {
				// Async update in CC
				setTimeout(() => {
					expect($('thead th:eq(0) .dtcc-button_dropdown:visible').length).toBe(0);
					done();
				}, 200);
			});
		});

		// Same again, but with hidable option disabled
		dt.html('empty');

		it('Create Ajax table with CC searchList', (done) => {
			$('#example thead th:gt(1)').remove();
			$('#example tfoot th:gt(1)').remove();

			var data1 = {
				data: [
					{ A: '1,1', B: '1,2' },
					{ A: '2,1', B: '2,2' }
				],
				columnControl: {
					A: ['1,1', '1,2', '1,3']
				}
			};

			var data2 = {
				data: [
					{ A: '5,1', B: '5,2' },
					{ A: '6,1', B: '6,2' },
					{ A: '7,1', B: '7,2' },
					{ A: '8,1', B: '8,2' }
				],
				columnControl: {}
			};

			var loaded1 = false;

			table = new DataTable('#example', {
				ajax: function (data, cb) {
					if (loaded1) {
						cb(data2);
					}
					else {
						loaded1 = true;
						cb(data1);
					}
				},
				columnControl: [
					[
						{
							extend: 'searchList',
							ajaxOnly: true,
							hidable: false
						}
					]
				],
				columns: [{ data: 'A' }, { data: 'B' }],
				initComplete: () => {
					done();
				}
			});
		});

		it('Check that a list is present for first column', () => {
			expect($('thead th:eq(0) .dtcc-button_dropdown:visible').length).toBe(1);
		});

		it('Shows dropdown when clicked', () => {
			$('.dtcc-button_dropdown')
				.eq(0)
				.trigger('click');

			expect($('.dtcc-dropdown').length).toBe(1);
		});

		it('Has a search list in it', () => {
			expect($('div.dtcc-list').length).toBe(1);
		});

		it('There is a button for the defined search terms', () => {
			expect($('div.dtcc-list button.dtcc-button').length).toBe(3);
		});

		it('Clicking on the body closes the dropdown', () => {
			$('body').trigger('click');

			expect($('.dtcc-dropdown').length).toBe(0);
		});

		it('Does not hide when reloaded and no options provided', (done) => {
			table.ajax.reload(() => {
				// Async update in CC
				setTimeout(() => {
					expect($('thead th:eq(0) .dtcc-button_dropdown:visible').length).toBe(1);
					done();
				}, 200);
			});
		});

		it('Shows dropdown when clicked', () => {
			$('.dtcc-button_dropdown')
				.eq(0)
				.trigger('click');

			expect($('.dtcc-dropdown').length).toBe(1);
		});

		it('Has a search list in it', () => {
			expect($('div.dtcc-list').length).toBe(1);
		});

		it('There is a button for the defined search terms', () => {
			expect($('div.dtcc-list button.dtcc-button').length).toBe(3);
		});

		it('Clicking on the body closes the dropdown', () => {
			$('body').trigger('click');

			expect($('.dtcc-dropdown').length).toBe(0);
		});
	});
});
