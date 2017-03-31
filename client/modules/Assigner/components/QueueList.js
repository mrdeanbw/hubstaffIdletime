import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

// Import Components
import QueueListItem from './QueueListItem/QueueListItem';

function QueueList(props) {
  return (
    <div className="listView">
      {
        props.queues.map(queue => (
          <QueueListItem
            queue={queue}
            key={queue.project_id}
            handleProjectAssigned={this.handleProjectAssigned}
          />
        ))
      }
    </div>
  );
}

QueueList.propTypes = {
  queues: PropTypes.array.isRequired,
  handleProjectAssigned: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  
});

export default connect(mapStateToProps)(QueueList);
