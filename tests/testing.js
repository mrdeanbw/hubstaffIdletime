import test from 'ava';
import reducer from '../client/modules/Assigner/AssignerReducer';
import {selectProject} from '../client/modules/Assigner/AssignerActions';

var data = require('./me-submission_requests.json');

test('Update data', t => {
	t.pass();
})

test('selectProject action', t => {
  t.deepEqual(selectProject(5), {
    type: "SELECT_PROJECT", 
    projectId: 5
  })

})

test('Toggle project', t => {
	const expected = {data: [
			  "id": 1,
			  "selected": false
		]};
	const state = reducer({data: 
		[
			  "id": 1,
			  "selected": true
		]
		},
	    {type: 'TOGGLE_PROJECT'})

	t.deepEqual( expected, state)
})

test('Fetch json data and return', t => {
	const expected = {data: [
			  "id": 1,
			  "selected": true
		]};
	const state = reducer({data: 
		[
			  "id": 1,
			  "selected": true
		]
		},
	    {type: 'SELECT_PROJECT'})

	t.deepEqual(state, expected)
})