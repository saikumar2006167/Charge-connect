import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getVehicles,
   addVehicle,
  updateVehicle,
deleteVehicle,
 } from "../api/vehicleApi";
import { FaCar,
   FaPlus,
  FaEdit,
FaTrash,
} from "react-icons/fa";

export default function MyVehicles() {
  const auth = getAuth();

  const user = auth.currentUser;

  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);

const [formData, setFormData] = useState({
  vehicleBrand: "",
  vehicleModel: "",
  vehicleNumber: "",
  connectorType: "",
  batteryCapacity: "",
 
});
const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      if (!user) return;

      const data = await getVehicles(user.uid);

      setVehicles(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddVehicle = async () => {
  try {
    if (!user) return;

    await addVehicle({
      uid: user.uid,
      ownerName: user.displayName || "",
      ...formData,
    });

    alert("Vehicle Added Successfully ✅");

    setShowForm(false);

    setFormData({
      vehicleBrand: "",
      vehicleModel: "",
      vehicleNumber: "",
      connectorType: "",
      batteryCapacity: "",
    });

    loadVehicles();
  } catch (err) {
    console.log(err);
    alert("Failed to Add Vehicle");
  }
};

const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Delete this vehicle?"
  );

  if (!confirmDelete) return;

  try {
    await deleteVehicle(id);

    alert("Vehicle Deleted Successfully");

    loadVehicles();
  } catch (err) {
    console.log(err);
    alert("Delete Failed");
  }
};

const handleEdit = (vehicle) => {

  setEditingId(vehicle.id);

  setFormData({
    vehicleBrand: vehicle.vehicleBrand,
    vehicleModel: vehicle.vehicleModel,
    vehicleNumber: vehicle.vehicleNumber,
    connectorType: vehicle.connectorType,
    batteryCapacity: vehicle.batteryCapacity,
  });

  setShowForm(true);
};

const handleUpdateVehicle = async () => {
  try {
    await updateVehicle(editingId, formData);

    alert("Vehicle Updated Successfully ✅");

    setEditingId(null);

    setShowForm(false);

    setFormData({
      vehicleBrand: "",
      vehicleModel: "",
      vehicleNumber: "",
      connectorType: "",
      batteryCapacity: "",
    });

    loadVehicles();
  } catch (err) {
    console.log(err);
    alert("Update Failed");
  }
};

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
        {showForm && (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

    <div className="bg-white w-[500px] rounded-3xl p-8 shadow-2xl">

      <h2 className="text-3xl font-bold text-green-600 mb-6">
        Add Vehicle
      </h2>

      <input
        type="text"
        placeholder="Vehicle Brand"
        className="w-full border rounded-xl p-3 mb-4"
        value={formData.vehicleBrand}
        onChange={(e) =>
          setFormData({
            ...formData,
            vehicleBrand: e.target.value,
          })
        }
      />

      <input
        type="text"
        placeholder="Vehicle Model"
        className="w-full border rounded-xl p-3 mb-4"
        value={formData.vehicleModel}
        onChange={(e) =>
          setFormData({
            ...formData,
            vehicleModel: e.target.value,
          })
        }
      />

      <input
        type="text"
        placeholder="Vehicle Number"
        className="w-full border rounded-xl p-3 mb-4"
        value={formData.vehicleNumber}
        onChange={(e) =>
          setFormData({
            ...formData,
            vehicleNumber: e.target.value,
          })
        }
      />

      <select
        className="w-full border rounded-xl p-3 mb-4"
        value={formData.connectorType}
        onChange={(e) =>
          setFormData({
            ...formData,
            connectorType: e.target.value,
          })
        }
      >
        <option value="">Select Connector</option>
        <option>CCS2</option>
        <option>Type 2</option>
        <option>CHAdeMO</option>
        <option>GB/T</option>
      </select>

      <input
        type="text"
        placeholder="Battery Capacity (Ex: 40 kWh)"
        className="w-full border rounded-xl p-3 mb-6"
        value={formData.batteryCapacity}
        onChange={(e) =>
          setFormData({
            ...formData,
            batteryCapacity: e.target.value,
          })
        }
      />

      <div className="flex justify-end gap-4">

       <button
  onClick={() => {

    setShowForm(false);

    setEditingId(null);

    setFormData({
      vehicleBrand: "",
      vehicleModel: "",
      vehicleNumber: "",
      connectorType: "",
      batteryCapacity: "",
    });

  }}
  className="px-6 py-3 rounded-xl bg-gray-300 hover:bg-gray-400"
>
  Cancel
</button>

       <button
  onClick={editingId ? handleUpdateVehicle : handleAddVehicle}
  className="px-6 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700"
>
  {editingId ? "Update Vehicle" : "Save Vehicle"}
</button>

      </div>

    </div>

  </div>
)}

      <div className="max-w-5xl mx-auto">

        {/* Header */}

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-4xl font-bold text-green-600">
            My Vehicles
          </h1>

          <button
            onClick={() => setShowForm(true)}
  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2" 
          >
            <FaPlus />
            Add Vehicle
          </button>

        </div>

        {vehicles.length === 0 ? (

          <div className="bg-white rounded-3xl shadow-xl p-16 text-center">

            <FaCar
              className="mx-auto text-gray-400"
              size={80}
            />

            <h2 className="text-3xl font-bold mt-6">
              No Vehicles Added
            </h2>

            <p className="text-gray-500 mt-3">
              Click "Add Vehicle" to register your EV.
            </p>

          </div>

        ) : (

         <div className="grid md:grid-cols-2 gap-6">

  {vehicles.map((vehicle) => (

    <div
      key={vehicle.id}
      className="bg-white rounded-3xl shadow-xl p-6"
    >

      <h2 className="text-2xl font-bold text-green-600">
        {vehicle.vehicleBrand}
      </h2>

      <p className="mt-3">
        <b>Model :</b> {vehicle.vehicleModel}
      </p>

      <p className="mt-2">
        <b>Number :</b> {vehicle.vehicleNumber}
      </p>

      <p className="mt-2">
        <b>Connector :</b> {vehicle.connectorType}
      </p>

      <p className="mt-2">
        <b>Battery :</b> {vehicle.batteryCapacity}
      </p>

      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={() => handleEdit(vehicle)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <FaEdit />
          Edit
        </button>

        <button
          onClick={() => handleDelete(vehicle.id)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <FaTrash />
          Delete
        </button>

      </div>

    </div>

  ))}

</div>
        )}

      </div>

    </div>
  );
}
