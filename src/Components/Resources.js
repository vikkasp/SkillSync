import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Courses() {
  const [courses, setCourses] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Fetch courses from backend API
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-primary">📚 Available Courses</h2>
      <div className="row mt-4">
        {courses.length === 0 ? (
          <p>No courses available.</p>
        ) : (
          courses.map((course) => (
            <div className="col-md-4 mb-3" key={course.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text">{course.description}</p>
                  <span className="badge bg-secondary">{course.level}</span>
                  {/* Optional Join Course button */}
                  <div className="mt-3">
                    <button
                      className="btn btn-outline-success"
                      onClick={() => handleJoinCourse(course.id)}
                    >
                      Join Course
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  async function handleJoinCourse(courseId) {
    try {
      await axios.post('http://localhost:8080/api/user-courses', {
        userId: user.id,
        courseId,
        progressPercentage: 0,
        isCompleted: false,
      });
      alert('Course joined successfully!');
    } catch (error) {
      console.error('Failed to join course:', error);
      alert('Error joining course.');
    }
  }
}

export default Courses;
