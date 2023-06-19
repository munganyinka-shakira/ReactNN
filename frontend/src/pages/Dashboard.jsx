import { useEffect, useState, useRef } from "react";
import "../assets/scss/dashboard.scss";
import "../assets/scss/modal.scss";
import Modal from "../components/Modal";
import { selectIsLoggedIn } from "../store/modules/authSlice";
import AppServices from "../services";
import toast from "react-hot-toast";
import {
  selectEquipmentLaptopOwners,
  setEquipmentLaptopOwners,
  addEquipmentLaptoprOwner,
  updateEquipmentLaptopOwner,
  removeEquipmentLaptopOwner,
} from "../store/modules/equipmentLaptopOwnerSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectLaptopOwners, setLaptopOwners } from "../store/modules/laptopOwnerSlice";
import { selectEquipments, setEquipments } from "../store/modules/equipmentSlice";

function EquipmentLaptopOwners() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const equipmentLaptopOwners = useSelector(selectEquipmentLaptopOwners);
  const laptopOwners = useSelector(selectLaptopOwners);
  const equipments = useSelector(selectEquipments);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState({});

  useEffect(() => {
    if (isLoggedIn) {
      AppServices.getEquipmentLaptopOwners().then((response) => {
        if (response.data.data) {
          dispatch(setEquipmentLaptopOwners(response.data.data));
        }
      });

      AppServices.getLaptopOwners().then((response) => {
        if (response.data.data) {
          dispatch(setLaptopOwners(response.data.data));
        }
      });

      AppServices.getEquipments().then((response) => {
        if (response.data.data) {
          dispatch(setEquipments(response.data.data))
        }
      })
    }
  }, [isLoggedIn]);

  const childRef = useRef(null);

  const toggleModal = () => {
    if (childRef.current) childRef.current.toggleModal();
  };

  const [selectedEquipmentLaptopOwner, setSelectedEquipmentLaptopOwner] = useState({});
  const [selectedEquipmentLaptopOwnerId, setSelectedEquipmentLaptopOwnerId] =
    useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const isUpdating = selectedEquipmentLaptopOwnerId !== "";

    toast.promise(
      isDeleting
        ? AppServices.deleteEquipmentLaptopOwner(selectedEquipmentLaptopOwnerId)
        : isUpdating
        ? AppServices.updateEquipmentLaptopOwner(
            selectedEquipmentLaptopOwner,
            selectedEquipmentLaptopOwnerId
          )
        : AppServices.registerEquipmentLaptopOwner(selectedEquipmentLaptopOwner),
      {
        loading: `${
          isDeleting ? "Deleting" : isUpdating ? "Updating" : "Creating"
        } EquipmentLaptopOwner ...`,
        success: (response) => {
          if (isDeleting)
            dispatch(removeEquipmentLaptopOwner(selectedEquipmentLaptopOwnerId));
          else if (isUpdating)
            dispatch(
              updateEquipmentLaptopOwner({
                ...response.data.data,
                ...selectedEquipmentLaptopOwner,
              })
            );
          else dispatch(addEquipmentLaptopOwner(response.data.data));

          if (selectedEquipmentLaptopOwner.password?.length) {
            AppServices.updateEquipmentLaptopOwnerPassword(
              {
                newPassword: selectedEquipmentLaptopOwner.password,
                confirmPassword: selectedEquipmentLaptopOwner.password,
              },
              selectedEquipmentLaptopOwnerId
            );
          }

          let message = `${
            isDeleting ? "Deleted" : isUpdating ? "Updated" : "Created"
          } EquipmentLaptopOwner successfully`;
          if (isUpdating) setSelectedEquipmentLaptopOwnerId("");
          if (isDeleting) setIsDeleting(false);
          setSelectedEquipmentLaptopOwner({});
          toggleModal();
          return message;
        },
        error: (error) => {
          let message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          if (message.includes("required pattern"))
            if (message.includes("chasisNumber"))
              return "invalid chasisNumber number";
            else return "invalid manufactureCompany";
          return message;
        },
      }
    );
  };

  return (
    <div className="pl-10 pt-10">
      <div>
        <div className="title">History of Equipment Ownership</div>
        <div className="md:flex">
          <div className="w-full">
            <div className="md:flex">
              <div>
                <button onClick={toggleModal} className="requestRegNum flex">
                  <div>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14 14.252V22H4C3.99969 20.7789 4.27892 19.5739 4.8163 18.4774C5.35368 17.3809 6.13494 16.4219 7.10022 15.674C8.0655 14.9261 9.18918 14.4091 10.3852 14.1626C11.5811 13.9162 12.8177 13.9467 14 14.252ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM18 17V14H20V17H23V19H20V22H18V19H15V17H18Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <div className="mt-1">Create a new EquipmentLaptopOwner</div>
                </button>
              </div>
              <div className="flex ml-auto mr-6">
                <div className="mt-2 ml-4">
                  <input
                    onChange={(e) => {
                      setFilter({ ...filter, search: e.target.value });
                    }}
                    type="text"
                    name=""
                    id=""
                    placeholder="search"
                    className="input px-3 py-1"
                  />
                </div>
              </div>
            </div>
            <div className="table w-full">
              <table>
                <thead>
                  <tr
                    className="
              flex flex-col flex-no
              wrap
              table-row
              rounded-l-lg rounded-none
              mb-2 mb-0
            "
                  >
                    <th>User Names</th>
                    <th>serialNumber</th>
                    <th>Manufacturer</th>
                    <th>Date Assigned</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="sm:flex-1 sm:flex-none">
                  {EquipmentLaptopOwners.map((doc) => (
                    <tr
                      key={doc._id}
                      className="
              sm:flex
              sm:flex-col
              sm:flex-no
              sm:wrap
              sm:table-row
              sm:mb-2
              sm:mb-0
              main-header
              sm:header tr
            "
                    >
                      <td className="pt-1 p-3">
                        <div className="flex">
                          <div></div>
                          <div>{doc?.laptopOwner.names}</div>
                        </div>
                      </td>
                      <td className="pt-1 p-3">
                        {" "}
                        <div className="">{doc?.equipment.modelName}</div>
                      </td>
                      <td className="pt-1 p-3">{doc?.equipment.price}</td>
                      <td className="pt-1 p-3">{doc?.equipmentserialNumber}</td>
                      <td className="pt-1 p-3">
                        {((date) => {
                          return `${date.getDate()}/${
                            date.getMonth() + 1
                          }/${date.getFullYear()}`;
                        })(new Date(doc?.createdAt))}
                      </td>
                      <td className="pt-1 p-3">
                        <div className="flex">
                          <div
                            onClick={() => {
                              setSelectedEquipmentLaptopOwner({
                                laptopOwner: doc.laptopOwner._id,
                                equipment: doc.equipment._id,
                                equipmentserialNumber: doc.equipmentserialNumber,
                              });
                              setSelectedEquipmentLaptopOwnerId(doc._id);
                              toggleModal();
                            }}
                            className="status cursor-pointer rounded mr-2"
                          >
                            Update
                          </div>
                          <div
                            onClick={() => {
                              setIsDeleting(true);
                              setSelectedEquipmentLaptopOwnerId(doc._id);
                              toggleModal();
                            }}
                            className="status cursor-pointer rounded"
                          >
                            Delete
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal ref={childRef} width="767px">
        {isDeleting ? (
          <div>
            <div className="modal-title text-center my-10">
              Are you sure you want to delete the selected EquipmentLaptopOwner ?
            </div>
            <div className="modal-footer my-10">
              <div className="flex justify-center">
                <button className="cancel mr-9" onClick={toggleModal}>
                  No
                </button>
                <button onClick={handleSubmit}>Yes</button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="modal-title text-center my-10">
              {selectedEquipmentLaptopOwnerId !== ""
                ? "Update EquipmentLaptopOwner"
                : "Create EquipmentLaptopOwner"}
            </div>
            <div className="modal-body">
              <form>
                <div className="">
                  <div className="px-4 py-5 bg-white sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="department"
                          className="block text-sm font-medium text-gray-700"
                        >
                          laptop owner
                        </label>
                        <select
                          defaultValue={selectedEquipmentLaptopOwner?.laptopOwner}
                          onChange={(e) => {
                            setSelectedEquipmentLaptopOwner({
                              ...selectedEquipmentLaptopOwner,
                              laptopOwner: e.target.value,
                            });
                          }}
                          id="first-name"
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="">Select laptop owner</option>
                          {laptopOwners.map((el) => (
                            <option key={el._id} value={el._id}>
                              {el.names}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="department"
                          className="block text-sm font-medium text-gray-700"
                        >
                          equipment
                        </label>
                        <select
                          defaultValue={selectedEquipmentLaptopOwner?.laptopOwner}
                          onChange={(e) => {
                            setSelectedEquipmentLaptopOwner({
                              ...selectedEquipmentLaptopOwner,
                              equipment: e.target.value,
                            });
                          }}
                          id="first-name"
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="">Select equipment</option>
                          {equipments.map((el) => (
                            <option key={el._id} value={el._id}>
                              {el.modelName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Equipment serial number
                        </label>
                        <input
                          defaultValue={
                            selectedEquipmentLaptopOwner?.equipmentserialNumber
                          }
                          onChange={(e) => {
                            setSelectedEquipmentLaptopOwner({
                              ...selectedEquipmentLaptopOwner,
                              equipmentserialNumber: e.target.value,
                            });
                          }}
                          type="text"
                          id="password"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer my-10">
              <div className="flex justify-center">
                <button className="cancel mr-9" onClick={toggleModal}>
                  Cancel
                </button>
                <button onClick={handleSubmit}>Submit</button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default EquipmentLaptopOwners;
