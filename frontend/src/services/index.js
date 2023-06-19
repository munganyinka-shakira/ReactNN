import axios from "axios";

export const API_URL = "http://localhost:8080/api";


class AppServices {
  login(body) {
    return axios.post(`${API_URL}/users/` + "login", body);
  }

  updateUser(body, id) {
    return axios.put(`${API_URL}/users`, body);
  }

  getCurrentUser() {
    return axios.get(`${API_URL}/users/current`);
  }

  register(body) {
    return axios.post(`${API_URL}/users`, body);
  }

  deleteUser() {
    return axios.delete(`${API_URL}/users`);
  }

  updateEquipment(body, id) {
    return axios.put(`${API_URL}/equipments/` + id, body);
  }
  deleteEquipment(id) {
    return axios.delete(`${API_URL}/equipments/` + id);
  }

  registerEquipment(body) {
    return axios.post(`${API_URL}/equipments/`, body);
  }
  getEquipments(query="page=1&limit=10") {
    return axios.get(`${API_URL}/equipments?${query}`);
  }

  updateLaptopOwner(body, id) {
    return axios.put(`${API_URL}/laptopOwners/` + id, body);
  }
  deleteLaptopOwner(id) {
    return axios.delete(`${API_URL}/laptopOwners/` + id);
  }

  registerLaptopOwner(body) {
    return axios.post(`${API_URL}/laptopOwners/`, body);
  }
  getLaptopOwners(query="page=1&limit=10") {
    return axios.get(`${API_URL}/laptopOwners?${query}`);
  }

  updateEquipmentLaptopOwner(body, id) {
    return axios.put(`${API_URL}/EquipmentLaptopOwners/` + id, body);
  }
  deleteEquipmentLaptopOwner(id) {
    return axios.delete(`${API_URL}/equipmentLaptopOwners/` + id);
  }

  registerEquipmentLaptopOwner(body) {
    return axios.post(`${API_URL}/equipmentLaptopOwners/`, body);
  }
  getEquipmentLaptopOwners(query="page=1&limit=10") {
    return axios.get(`${API_URL}/equipmentLaptopOwners?${query}`);
  }
}

export default new AppServices();