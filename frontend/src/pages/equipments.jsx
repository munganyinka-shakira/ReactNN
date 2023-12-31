import { useEffect, useState,useRef } from 'react'
import '../assets/scss/dashboard.scss'
import '../assets/scss/modal.scss'
import Modal from '../components/Modal';
import { selectIsLoggedIn } from '../store/modules/authSlice';
import AppServices from "../services";
import toast from 'react-hot-toast';
import { selectVehicles, setVehicles,addVehicle,updateVehicle,removeVehicle } from '../store/modules/equipmentSlice';
import { useDispatch, useSelector } from 'react-redux';

function Equipments() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const vehicles = useSelector(selectVehicles);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState({});

  useEffect(() => {
    if (isLoggedIn) {
      AppServices.getEquipments().then((response) => {
        if (response.data.data) {
          dispatch(setEquipments(response.data.data))
        }
      })
    }
  }, [isLoggedIn])

  const childRef = useRef(null);

  const toggleModal = () => {
    if (childRef.current)
      childRef.current.toggleModal();
  }


  const [selectedEquipment, setSelectedEquipment] = useState({})
  const [selectedEquipmentId, setSelectedEquipmentId] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)


  const handleSubmit = (e) => {
    e.preventDefault();

    const isUpdating = selectedEquipmentId !== "";

    toast.promise(
      isDeleting ? AppServices.deleteEquipment(selectedEquipmentId) : isUpdating ? AppServices.updateEquipment(selectedEquipment, selectedEquipmentId) : AppServices.registerEquipment(selectedEquipment),
      {
        loading: `${isDeleting ? 'Deleting' : isUpdating ? 'Updating' : 'Creating'} equipment ...`,
        success: (response) => {
          if (isDeleting) dispatch(removeEquipment(selectedEquipmentId));
          else if (isUpdating) dispatch(updateEquipment({...response.data.data,...selectedEquipment}));
          else dispatch(addEquipment(response.data.data))

          if (selectedEquipment.password?.length) {
            AppServices.updateEquipmentPassword({ newPassword: selectedEquipment.password, confirmPassword: selectedEquipment.password }, selectedEquipmentId)
          }

          let message = `${isDeleting ? 'Deleted' : isUpdating ? 'Updated' : 'Created'} equipment successfully`
          if (isUpdating) setSelectedEquipmentId("");
          if (isDeleting) setIsDeleting(false);
          setSelectedEquipment({});
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
            if(message.includes("required pattern"))
            if(message.includes("chasisNumber")) return "invalid chasisNumber number";
            else return "invalid laptop maufacturer"
          return message;
        },
      }
    );
  }

  return (
    <div className="pl-10 pt-10">
      <div>
        <div className="title">
          Equipments
        </div>
        <div className="md:flex">
          <div className='w-full'>
            <div className="md:flex">
              <div><button onClick={toggleModal} className='requestRegNum flex'>
                <div><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 14.252V22H4C3.99969 20.7789 4.27892 19.5739 4.8163 18.4774C5.35368 17.3809 6.13494 16.4219 7.10022 15.674C8.0655 14.9261 9.18918 14.4091 10.3852 14.1626C11.5811 13.9162 12.8177 13.9467 14 14.252ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM18 17V14H20V17H23V19H20V22H18V19H15V17H18Z" fill="white" />
                </svg>

                </div>
                <div className='mt-1'>Create a new equipment</div>

              </button>
              </div>
              <div className='flex ml-auto mr-6'>
                <div className='mt-2 ml-4'>
                  <input onChange={(e) => { setFilter({ ...filter, search: e.target.value }) }} type="text" name="" id="" placeholder='search' className='input px-3 py-1' />
                </div>
              </div>
            </div>
            <div className='table w-full'>
              <table>
                <thead>
                  <tr
                    className="
              flex flex-col flex-no
              wrap
              
              rounded-l-lg rounded-none
              
            "
                  >
                    
                    <th>Chasis Number</th>
                    <th>Manufacturer</th>
                    <th>serialNumber</th>
                    <th>Model</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="sm:flex-none">
                  {
                  vehicles.map((doc) => <tr key={doc._id} className="
              sm:flex
              sm:flex-col
              sm:flex-no
              sm:wrap
              main-header
              sm:header tr
            ">
                   
                    <td className='pt-1 p-3'>                      <div className=''>
                      {doc?.chasisNumber}
                    </div></td>
                    <td className='pt-1 p-3'>{doc?.Manufacturer}</td>
                    <td className='pt-1 p-3'>{doc?.serialNumber}</td>
                    <td className='pt-1 p-3'>{doc?.Model}</td>
                    <td className='pt-1 p-3'>
                      <div className="flex">
                        <div onClick={() => { setSelectedEquipment({ serialNumber: doc.serialNumber,Manufacturer: doc.Manufacturer, chasisNumber: doc.chasisNumber}); setSelectedEquipmentId(doc._id); toggleModal(); }} className='status cursor-pointer rounded mr-2'>
                          Update
                        </div>
                        <div onClick={() => { setIsDeleting(true); setSelectedEquipmentId(doc._id); toggleModal() }} className='status cursor-pointer rounded'>
                          Delete
                        </div>
                      </div>
                    </td>
                  </tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div >
      <Modal ref={childRef} width="767px">
        {isDeleting ? <div>
          <div className="modal-title text-center my-10">
            Are you sure you want to delete the selected equipment ?
          </div>
          <div className="modal-footer my-10">
            <div className="flex justify-center">
              <button className='cancel mr-9' onClick={toggleModal}>No</button>
              <button onClick={handleSubmit}>Yes</button>
            </div>
          </div>
        </div> : <div>
          <div className="modal-title text-center my-10">
            {selectedVehicleId !== "" ? "Update equipment" : "Create equipment"}
          </div>
          <div className="modal-body">
            <form>
              <div className="">
                <div className="px-4 py-5 bg-white sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">Manufacture company</label>
                      <input defaultValue={selectedEquipment?.Manufacturer} onChange={(e) => { setSelectedEquipment({ ...selectedEquipment, Manufacturer: e.target.value }) }} type="text" id="password" className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">Chasis number</label>
                      <input defaultValue={selectedEquipment?.chasisNumber} onChange={(e) => { setSelectedEquipment({ ...selectedEquipment, chasisNumber: e.target.value }) }} type="number" id="email-address" className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="email-address1" className="block text-sm font-medium text-gray-700">serialNumber</label>
                      <input defaultValue={selectedEquipment?.serialNumber} onChange={(e) => { setSelectedEquipment({ ...selectedEquipment, serialNumber: e.target.value }) }} type="number" id="email-address1" className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="password1" className="block text-sm font-medium text-gray-700">Manufacturer</label>
                      <input defaultValue={selectedEquipment?.Manufacturer} onChange={(e) => { setSelectedEquipment({ ...selectedEquipment, Manufacturer: e.target.value }) }} type="number" id="password1" className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer my-10">
            <div className="flex justify-center">
              <button className='cancel mr-9' onClick={toggleModal}>Cancel</button>
              <button onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        </div>}
      </Modal>
    </div >
  )
}

export default Equipments
