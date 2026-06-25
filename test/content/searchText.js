describe('columnControl - searchText', function () {
	dt.libs({
		js: ['jquery', 'datatables', 'columncontrol'],
		css: ['datatables', 'columncontrol']
	});

	describe('Basic functionality', function () {
		let table;

		dt.html('basic');

		it('Is present', () => {
			expect(DataTable.ColumnControl.content.searchText).toBeDefined();
		});

		it('Create CC with search', () => {
			table = new DataTable('#example', {
				columnControl: {
					target: 1,
					content: ['searchText']
				}
			});

			expect($('.dtcc-searchText').length).toBe(6);
		});

		it('There is an input element in each cell in the second header row', () => {
			expect($('thead tr:eq(1) input').length).toBe(6);
			expect($('thead tr:eq(1) td:eq(0) input').length).toBe(1);
		});

		it('There is no initial search value', () => {
			expect($('thead tr:eq(1) td:eq(0) input').val()).toBe('');
		});

		it('Is shown as not active', () => {
			expect(
				$('thead tr:eq(1) td:eq(0) div.dtcc-search').hasClass('dtcc-search_active')
			).toBe(false);
		});

		it('Can apply a search', () => {
			$('thead tr:eq(1) td:eq(0) input')
				.val('br')
				.triggerNative('input');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Bradley Greer');
		});

		it('Search input is shown as active when there is a filter', () => {
			expect(
				$('thead tr:eq(1) td:eq(0) div.dtcc-search').hasClass('dtcc-search_active')
			).toBe(true);
		});

		it('Cumulative search over two columns', () => {
			$('thead tr:eq(1) td:eq(1) input')
				.val('d')
				.triggerNative('input');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Jackson Bradshaw');
		});

		it('Cumulative search over three columns', () => {
			$('thead tr:eq(1) td:eq(2) input')
				.val('s')
				.triggerNative('input');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Michael Bruce');
		});

		it('Remove search terms', () => {
			$('thead tr:eq(1) td:eq(0) input')
				.val('')
				.triggerNative('input');
			$('thead tr:eq(1) td:eq(1) input')
				.val('')
				.triggerNative('input');
			$('thead tr:eq(1) td:eq(2) input')
				.val('')
				.triggerNative('input');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});

		it('Back to not active', () => {
			expect(
				$('thead tr:eq(1) td:eq(0) div.dtcc-search').hasClass('dtcc-search_active')
			).toBe(false);
		});
	});

	describe('State saving', function () {
		dt.html('basic');

		it('Setup with state restore - no initial value', () => {
			localStorage.clear();

			table = new DataTable('#example', {
				columnControl: {
					target: 1,
					content: ['searchText']
				},
				stateSave: true
			});

			expect($('thead tr:eq(1) td:eq(0) input').val()).toBe('');
			expect($('thead tr:eq(1) td:eq(1) input').val()).toBe('');
		});

		it('Can apply a search', () => {
			$('thead tr:eq(1) td:eq(0) input')
				.val('Nixon')
				.triggerNative('input');
			$('thead tr:eq(1) td:eq(1) input')
				.val('Arch')
				.triggerNative('input');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Tiger Nixon');
		});

		dt.html('basic');

		it('Restore with a saved state', () => {
			table = new DataTable('#example', {
				columnControl: {
					target: 1,
					content: ['searchText']
				},
				stateSave: true
			});

			expect($('thead tr:eq(1) td:eq(0) input').val()).toBe('Nixon');
			expect($('thead tr:eq(1) td:eq(1) input').val()).toBe('Arch');
			expect($('thead tr:eq(1) td:eq(2) input').val()).toBe('');
		});

		it('And filter was applied', () => {
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Tiger Nixon');
		});

		it('Remove search terms', () => {
			$('thead tr:eq(1) td:eq(0) input')
				.val('')
				.triggerNative('input');
			$('thead tr:eq(1) td:eq(1) input')
				.val('')
				.triggerNative('input');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});

		it('Search logic set', () => {
			$('thead tr:eq(1) td:eq(0) select')
				.val('starts')
				.triggerNative('input');
			$('thead tr:eq(1) td:eq(0) input')
				.val('ash')
				.triggerNative('input');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
		});

		dt.html('basic');

		it('Restore state', () => {
			table = new DataTable('#example', {
				columnControl: {
					target: 1,
					content: ['searchText']
				},
				stateSave: true
			});

			expect($('thead tr:eq(1) td:eq(0) select').val()).toBe('starts');
			expect($('thead tr:eq(1) td:eq(0) input').val()).toBe('ash');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
		});

		it('Remove search terms', () => {
			$('thead tr:eq(1) td:eq(0) select')
				.val('contains')
				.triggerNative('input');
			$('thead tr:eq(1) td:eq(0) input')
				.val('')
				.triggerNative('input');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});
	});

	describe('State saving - with names', function () {
		dt.html('basic');

		it('Setup with state restore - no initial value', () => {
			localStorage.clear();

			table = new DataTable('#example', {
				columnControl: {
					target: 1,
					content: ['searchText']
				},
				stateSave: true,
				columns: [
					{name: 'a'},
					{name: 'b'},
					{name: 'c'},
					{name: 'd'},
					{name: 'e'},
					{name: 'f'},
				]
			});

			expect($('thead tr:eq(1) td:eq(0) input').val()).toBe('');
			expect($('thead tr:eq(1) td:eq(1) input').val()).toBe('');
		});

		it('Can apply a search', () => {
			$('thead tr:eq(1) td:eq(0) input')
				.val('Nixon')
				.triggerNative('input');
			$('thead tr:eq(1) td:eq(1) input')
				.val('Arch')
				.triggerNative('input');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Tiger Nixon');
		});

		dt.html('basic');

		it('Restore with a saved state', () => {
			table = new DataTable('#example', {
				columnControl: {
					target: 1,
					content: ['searchText']
				},
				stateSave: true,
				columns: [
					{name: 'a'},
					{name: 'b'},
					{name: 'c'},
					{name: 'd'},
					{name: 'e'},
					{name: 'f'},
				]
			});

			expect($('thead tr:eq(1) td:eq(0) input').val()).toBe('Nixon');
			expect($('thead tr:eq(1) td:eq(1) input').val()).toBe('Arch');
			expect($('thead tr:eq(1) td:eq(2) input').val()).toBe('');
		});

		it('And filter was applied', () => {
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Tiger Nixon');
		});

		dt.html('basic');

		it('Change order of columns using name', () => {
			table = new DataTable('#example', {
				columnControl: {
					target: 1,
					content: ['searchText']
				},
				stateSave: true,
				columns: [
					{name: 'b'},
					{name: 'a'},
					{name: 'c'},
					{name: 'd'},
					{name: 'e'},
					{name: 'f'},
				]
			});

			expect($('thead tr:eq(1) td:eq(1) input').val()).toBe('Nixon');
			expect($('thead tr:eq(1) td:eq(0) input').val()).toBe('Arch');
			expect(table.page.info().recordsDisplay).toBe(0);
		});

		dt.html('basic');

		it('Column not found', () => {
			table = new DataTable('#example', {
				columnControl: {
					target: 1,
					content: ['searchText']
				},
				stateSave: true,
				columns: [
					{name: 'bb'},
					{name: 'a'},
					{name: 'c'},
					{name: 'd'},
					{name: 'e'},
					{name: 'f'},
				]
			});

			expect($('thead tr:eq(1) td:eq(1) input').val()).toBe('Nixon');
			expect($('thead tr:eq(1) td:eq(0) input').val()).toBe('');
			expect(table.page.info().recordsDisplay).toBe(0);
		});
	});

	describe('Search logic', function () {
		dt.html('basic');

		it('Setup', () => {
			table = new DataTable('#example', {
				columnControl: {
					target: 1,
					content: ['searchText']
				}
			});

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});

		it('Has a logic selector', () => {
			expect($('thead tr:eq(1) td:eq(0) select').length).toBe(1);
			expect($('thead tr:eq(1) td select').length).toBe(6);
		});

		it('Default value is `contains`', () => {
			expect($('thead tr:eq(1) td:eq(0) select').val()).toBe('contains');
		});

		it('contains search - start of string', () => {
			$('thead tr:eq(1) td:eq(0) input')
				.val('Caesar Vanc')
				.triggerNative('input');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Caesar Vance');
		});

		it('contains search - middle of string', () => {
			$('thead tr:eq(1) td:eq(0) input')
				.val('illiam')
				.triggerNative('input');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Brielle Williamson');
		});

		it('contains search - end of string', () => {
			$('thead tr:eq(1) td:eq(0) input')
				.val('elly')
				.triggerNative('input');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Cedric Kelly');
		});

		it('contains search - is active', () => {
			expect(
				$('thead tr:eq(1) td:eq(0) div.dtcc-search').hasClass('dtcc-search_active')
			).toBe(true);
		});

		it('notContains search - start of string', () => {
			$('thead tr:eq(1) td:eq(0) select')
				.val('notContains')
				.triggerNative('input');
			$('thead tr:eq(1) td:eq(0) input')
				.val('Airi S')
				.triggerNative('input');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Angelica Ramos');
		});

		it('notContains search - middle of string', () => {
			$('thead tr:eq(1) td:eq(0) input')
				.val('Ram')
				.triggerNative('input');

			expect($('tbody tr:eq(1) td:eq(0)').text()).toBe('Ashton Cox');
		});

		it('notContains search - end of string', () => {
			$('thead tr:eq(1) td:eq(0) input')
				.val('Cox')
				.triggerNative('input');

			expect($('tbody tr:eq(2) td:eq(0)').text()).toBe('Bradley Greer');
		});

		it('notContains search - is active', () => {
			expect(
				$('thead tr:eq(1) td:eq(0) div.dtcc-search').hasClass('dtcc-search_active')
			).toBe(true);
		});

		it('equal search - matching', () => {
			$('thead tr:eq(1) td:eq(0) select')
				.val('equal')
				.triggerNative('input');
			$('thead tr:eq(1) td:eq(0) input')
				.val('Cara Stevens')
				.triggerNative('input');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Cara Stevens');
			expect($('tbody tr').length).toBe(1);
		});

		it('equal search - not matching', () => {
			$('thead tr:eq(1) td:eq(0) input')
				.val('Not here')
				.triggerNative('input');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('No matching records found');
			expect($('tbody tr').length).toBe(1);
		});

		it('equals search - is active', () => {
			expect(
				$('thead tr:eq(1) td:eq(0) div.dtcc-search').hasClass('dtcc-search_active')
			).toBe(true);
		});

		it('notEqual search - matching', () => {
			$('thead tr:eq(1) td:eq(0) select')
				.val('notEqual')
				.triggerNative('input');
			$('thead tr:eq(1) td:eq(0) input')
				.val('Airi Satou')
				.triggerNative('input');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Angelica Ramos');
		});

		it('notEqual search - not matching', () => {
			$('thead tr:eq(1) td:eq(0) input')
				.val('Not here')
				.triggerNative('input');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});

		it('notEqual search - is active', () => {
			expect(
				$('thead tr:eq(1) td:eq(0) div.dtcc-search').hasClass('dtcc-search_active')
			).toBe(true);
		});

		it('starts search - start of string, matches', () => {
			$('thead tr:eq(1) td:eq(0) select')
				.val('starts')
				.triggerNative('input');
			$('thead tr:eq(1) td:eq(0) input')
				.val('Caes')
				.triggerNative('input');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Caesar Vance');
		});

		it('starts search - start of string, no matches', () => {
			$('thead tr:eq(1) td:eq(0) select')
				.val('starts')
				.triggerNative('input');
			$('thead tr:eq(1) td:eq(0) input')
				.val('Never')
				.triggerNative('input');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('No matching records found');
		});

		it('starts search - middle of string', () => {
			$('thead tr:eq(1) td:eq(0) input')
				.val('illiam')
				.triggerNative('input');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('No matching records found');
		});

		it('starts search - end of string', () => {
			$('thead tr:eq(1) td:eq(0) input')
				.val('elly')
				.triggerNative('input');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('No matching records found');
		});

		it('start search - is active', () => {
			expect(
				$('thead tr:eq(1) td:eq(0) div.dtcc-search').hasClass('dtcc-search_active')
			).toBe(true);
		});

		it('ends search - start of string', () => {
			$('thead tr:eq(1) td:eq(0) select')
				.val('ends')
				.triggerNative('input');
			$('thead tr:eq(1) td:eq(0) input')
				.val('Bruno')
				.triggerNative('input');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('No matching records found');
		});

		it('ends search - middle of string', () => {
			$('thead tr:eq(1) td:eq(0) input')
				.val('illiam')
				.triggerNative('input');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('No matching records found');
		});

		it('ends search - end of string, matches', () => {
			$('thead tr:eq(1) td:eq(0) input')
				.val('agner')
				.triggerNative('input');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Brenden Wagner');
		});

		it('ends search - end of string, no match', () => {
			$('thead tr:eq(1) td:eq(0) input')
				.val('never')
				.triggerNative('input');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('No matching records found');
		});

		it('end search - is active', () => {
			expect(
				$('thead tr:eq(1) td:eq(0) div.dtcc-search').hasClass('dtcc-search_active')
			).toBe(true);
		});

		it('clear values', () => {
			$('thead tr:eq(1) td:eq(0) span.dtcc-search-clear').trigger('click');

			expect($('thead tr:eq(1) td:eq(0) input').val()).toBe('');
			expect($('thead tr:eq(1) td:eq(0) select').val()).toBe('contains');
		});

		it('Is shown as not active', () => {
			expect(
				$('thead tr:eq(1) td:eq(0) div.dtcc-search').hasClass('dtcc-search_active')
			).toBe(false);
		});

		it('set an empty value', () => {
			table
				.cell(0, 0)
				.data('')
				.draw();

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('');
			expect($('tbody tr:eq(0) td:eq(1)').text()).toBe('System Architect');
			expect($('tbody tr:eq(1) td:eq(0)').text()).toBe('Airi Satou');
		});

		it('empty search - matches', () => {
			$('thead tr:eq(1) td:eq(0) select')
				.val('empty')
				.triggerNative('input');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('');
			expect($('tbody tr:eq(0) td:eq(1)').text()).toBe('System Architect');
		});

		it('empty search - is active', () => {
			expect(
				$('thead tr:eq(1) td:eq(0) div.dtcc-search').hasClass('dtcc-search_active')
			).toBe(true);
		});

		it('notEmpty search - matches', () => {
			$('thead tr:eq(1) td:eq(0) select')
				.val('notEmpty')
				.triggerNative('input');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});

		it('notEmpty search - is active', () => {
			expect(
				$('thead tr:eq(1) td:eq(0) div.dtcc-search').hasClass('dtcc-search_active')
			).toBe(true);
		});
	});

	describe('Option - clear', function () {
		dt.html('basic');

		it('Clear button enabled (default)', () => {
			table = new DataTable('#example', {
				columnControl: {
					target: 1,
					content: ['searchText']
				}
			});

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});

		it('Clear button is not visible with no value', () => {
			expect($('thead tr:eq(1) td:eq(0) span.dtcc-search-clear').is(':visible')).toBe(false);
		});

		it('Apply a search', () => {
			$('thead tr:eq(1) td:eq(0) input')
				.val('zen')
				.triggerNative('input');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Zenaida Frank');
		});

		it('Clear button is now visible on this input', () => {
			expect($('thead tr:eq(1) td:eq(0) span.dtcc-search-clear').is(':visible')).toBe(true);
		});

		it('And only that one', () => {
			expect($('thead tr:eq(1) td:eq(1) span.dtcc-search-clear').is(':visible')).toBe(false);
		});

		it('Clearing makes it hidden again', () => {
			$('thead tr:eq(1) td:eq(0) input')
				.val('')
				.triggerNative('input');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
			expect($('thead tr:eq(1) td:eq(0) span.dtcc-search-clear').is(':visible')).toBe(false);
		});

		it('Apply a search', () => {
			$('thead tr:eq(1) td:eq(0) input')
				.val('zen')
				.triggerNative('input');

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Zenaida Frank');
		});

		it('Clicking the button will clear the input', () => {
			$('thead tr:eq(1) td:eq(0) span.dtcc-search-clear').trigger('click');

			expect($('thead tr:eq(1) td:eq(0) input').val()).toBe('');
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});

		it('And it was hidden', () => {
			expect($('thead tr:eq(1) td:eq(0) span.dtcc-search-clear').is(':visible')).toBe(false);
		});

		dt.html('basic');

		it('Clear button can be disabled', () => {
			table = new DataTable('#example', {
				columnControl: {
					target: 1,
					content: [
						{
							extend: 'searchText',
							clear: false
						}
					]
				}
			});

			expect($('thead tr:eq(1) td span.dtcc-search-clear').length).toBe(0);
		});
	});

	describe('Option - placeholder', function () {
		dt.html('basic');

		it('Placeholder (default)', () => {
			table = new DataTable('#example', {
				columnControl: {
					target: 1,
					content: ['searchText']
				}
			});

			expect($('thead tr:eq(1) td:eq(0) input').attr('placeholder')).toBeUndefined();
		});

		dt.html('basic');

		it('Set a placeholder', () => {
			table = new DataTable('#example', {
				columnControl: {
					target: 1,
					content: [
						{
							extend: 'searchText',
							placeholder: 'testA'
						}
					]
				}
			});

			expect($('thead tr:eq(1) td:eq(0) input').attr('placeholder')).toBe('testA');
		});

		dt.html('basic');

		it('Set a [title] placeholder', () => {
			table = new DataTable('#example', {
				columnControl: {
					target: 1,
					content: [
						{
							extend: 'searchText',
							placeholder: 'testB [title] testC'
						}
					]
				}
			});

			expect($('thead tr:eq(1) td:eq(0) input').attr('placeholder')).toBe('testB Name testC');
			expect($('thead tr:eq(1) td:eq(1) input').attr('placeholder')).toBe(
				'testB Position testC'
			);
		});
	});

	describe('Option - title', function () {
		dt.html('basic');

		it('Title (default)', () => {
			table = new DataTable('#example', {
				columnControl: {
					target: 1,
					content: ['searchText']
				}
			});

			expect($('thead tr:eq(1) td:eq(0) div.dtcc-search-title').text()).toBe('');
		});

		dt.html('basic');

		it('Set a static title', () => {
			table = new DataTable('#example', {
				columnControl: {
					target: 1,
					content: [
						{
							extend: 'searchText',
							title: 'testD'
						}
					]
				}
			});

			expect($('thead tr:eq(1) td:eq(0) div.dtcc-search-title').text()).toBe('testD');
		});

		dt.html('basic');

		it('Set a [title] placeholder', () => {
			table = new DataTable('#example', {
				columnControl: {
					target: 1,
					content: [
						{
							extend: 'searchText',
							title: 'testE [title] testF'
						}
					]
				}
			});

			expect($('thead tr:eq(1) td:eq(0) div.dtcc-search-title').text()).toBe(
				'testE Name testF'
			);
			expect($('thead tr:eq(1) td:eq(1) div.dtcc-search-title').text()).toBe(
				'testE Position testF'
			);
		});
	});

	describe('Option - titleAttr', function () {
		dt.html('basic');

		it('titleAttr (default)', () => {
			table = new DataTable('#example', {
				columnControl: {
					target: 1,
					content: ['searchText']
				}
			});

			expect($('thead tr:eq(1) td:eq(0) input').attr('title')).toBeUndefined();
		});

		dt.html('basic');

		it('Set a static title', () => {
			table = new DataTable('#example', {
				columnControl: {
					target: 1,
					content: [
						{
							extend: 'searchText',
							titleAttr: 'testG'
						}
					]
				}
			});

			expect($('thead tr:eq(1) td:eq(0) input').attr('title')).toBe('testG');
		});

		dt.html('basic');

		it('Set a [title] placeholder', () => {
			table = new DataTable('#example', {
				columnControl: {
					target: 1,
					content: [
						{
							extend: 'searchText',
							titleAttr: 'testH [title] testI'
						}
					]
				}
			});

			expect($('thead tr:eq(1) td:eq(0) input').attr('title')).toBe('testH Name testI');
			expect($('thead tr:eq(1) td:eq(1) input').attr('title')).toBe('testH Position testI');
		});
	});
});
