import React, { useState, useEffect } from "react";
import { getAllAssignTasks } from "../../API/AssignTaskAPI"; // Import the API function
import { getEmployees } from "../../API/AdminAPI"; // Import the getEmployees API function
import { getAllResources } from "../../API/ResourceAPI"; // Import the Resources API function
import axios from "axios";

function AssignResources() {
  const [assignTasks, setAssignTasks] = useState([]); // State to hold the fetched tasks
  const [employees, setEmployees] = useState([]); // State to hold the fetched employees
  const [resources, setResources] = useState([]); // State to hold the fetched resources
  const [loading, setLoading] = useState(true); // Loading state to show while fetching
  const [error, setError] = useState(""); // Error state to show if something goes wrong
  const [selectedResources, setSelectedResources] = useState({}); // To hold selected resources
  const [resourceQuantities, setResourceQuantities] = useState({}); // To track quantities for each resource

  useEffect(() => {
    const fetchAssignTasks = async () => {
      try {
        const data = await getAllAssignTasks(); // Fetch all tasks
        setAssignTasks(data); // Set the fetched tasks into state

        // Fetch employees and resources
        const employeeData = await getEmployees();
        setEmployees(employeeData);

        const resourceData = await getAllResources();
        setResources(resourceData);
      } catch (err) {
        setError("Failed to fetch assign tasks or employees/resources");
        console.error("Error fetching data:", err); // Log the error
      }
    };

    fetchAssignTasks(); // Fetch tasks, employees, and resources
  }, []);

  useEffect(() => {
    if (
      assignTasks.length > 0 &&
      resources.length > 0 &&
      employees.length > 0
    ) {
      setLoading(false); // Set loading to false once data is fetched
    }
  }, [assignTasks, resources, employees]);

  const handleResourceSelection = (resourceId, quantity) => {
    if (quantity < 1 || quantity > 1000) return; // Prevent invalid quantities
    setResourceQuantities((prevQuantities) => {
      return {
        ...prevQuantities,
        [resourceId]: quantity,
      };
    });
  };

  const handleAssignResourcesToTask = async (taskId) => {
    const selectedResourceIds = Object.keys(resourceQuantities);
    if (selectedResourceIds.length === 0) {
      alert("No resources selected!");
      return;
    }

    // Preparing task data to send to the backend
    const taskData = {
      taskId,
      resourcesId: selectedResourceIds
        .map((resourceId) => {
          const resource = resources.find((res) => res._id === resourceId);
          return resource ? resource._id : null;
        })
        .filter((id) => id !== null),
    };

    // Ensure that the total selected quantity does not exceed the available stock for each resource
    for (let resourceId of selectedResourceIds) {
      const resource = resources.find((res) => res._id === resourceId);
      if (resourceQuantities[resourceId] > resource.stock) {
        alert(`Cannot assign more than ${resource.stock} of ${resource.name}`);
        return;
      }
    }

    try {
      const response = await axios.put(
        "http://localhost:5000/assign-task/resources", // Ensure this matches your backend endpoint
        taskData
      );

      console.log("Resources Assigned:", response.data);
      alert("Resources successfully assigned to the task!");
    } catch (err) {
      console.error("Error assigning resources:", err);
      alert("Error assigning resources. Please check the console for details.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-screen-3xl mx-auto p-8 rounded-lg shadow-xl bg-white">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Assigned Tasks
        </h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse shadow-md rounded-lg bg-white">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-3 border-b text-left">Task ID</th>
                <th className="px-6 py-3 border-b text-left">Employee Names</th>
                <th className="px-6 py-3 border-b text-left">Resources</th>
                <th className="px-6 py-3 border-b text-left">
                  Assign Resources
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {assignTasks.map((task) => (
                <tr
                  key={task._id}
                  className="hover:bg-gray-50 hover:text-gray-700 transition-all duration-300"
                >
                  <td className="px-6 py-4 border-b">{task.taskId}</td>
                  <td className="px-6 py-4 border-b">
                    {task.employeeIds
                      .map((empId) => {
                        const employee = employees.find(
                          (emp) => emp._id === empId
                        );
                        return employee ? employee.name : "N/A";
                      })
                      .join(", ")}
                  </td>
                  <td className="px-6 py-4 border-b">
                    {resources.map((resource) => (
                      <div
                        key={resource._id}
                        className="flex justify-between items-center"
                      >
                        <label>{resource.name}</label>
                        <input
                          type="number"
                          min="1"
                          max={resource.stock}
                          value={resourceQuantities[resource._id] || ""}
                          onChange={(e) =>
                            handleResourceSelection(
                              resource._id,
                              e.target.value
                            )
                          }
                          className="w-20 px-2 py-1 border border-gray-300 rounded-md text-right"
                        />
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4 border-b">
                    <button
                      onClick={() => handleAssignResourcesToTask(task._id)}
                      className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                      Assign Resources
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AssignResources;
