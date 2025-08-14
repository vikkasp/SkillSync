import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container, Spinner, Alert } from 'react-bootstrap';

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/feedback');
        if (Array.isArray(response.data)) {
          setFeedbacks(response.data);
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (err) {
        setError('Failed to load feedback');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <Container className="mt-4">
      <h2>All Feedback Received</h2>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" />
          <p>Loading feedback...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : feedbacks.length === 0 ? (
        <Alert variant="info">No feedback available.</Alert>
      ) : (
        <Table striped bordered hover responsive className="mt-4">
           <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Skill</th>
            <th>Goal</th>
            <th>Rating</th>
            <th>Message</th>
            <th>Submitted At</th>
          </tr>
        </thead>
          <tbody>
          {feedbacks.map((fb) => (
            <tr key={fb.id}>
              <td>{fb.id}</td>
              <td>{fb.userName}</td>
              <td>{fb.skillName}</td>
              <td>{fb.goalTitle}</td>
              <td>{fb.rating}</td>
              <td>{fb.message}</td>
              <td>{new Date(fb.submittedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
        </Table>
      )}
    </Container>
  );
};

export default FeedbackList;
