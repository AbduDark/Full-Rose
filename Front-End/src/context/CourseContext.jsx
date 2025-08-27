import React, { createContext, useContext, useState, useEffect } from "react";
import { getCourses, getCourseById } from "../api/courses";
const CourseContext = createContext();

export const useCourse = () => useContext(CourseContext);

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCourses();
      setCourses(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.message);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      return await getCourseById(id);
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <CourseContext.Provider
      value={{
        courses,
        loading,
        error,
        fetchCourses,
        fetchCourseById,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
