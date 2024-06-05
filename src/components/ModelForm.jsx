"use client";
import React, { useState, useRef, useEffect } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import options from "@/data/options";
import Link from "next/link";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";
const generateUniqueId = () => {
  return Math.random().toString(36).substr(2, 9);
};

const ModelForm = () => {
  const [listingTitle, setListingTitle] = useState("");
  const [brands, setBrands] = useState([]);
  const [model, setModel] = useState("");
  const [models, setModels] = useState([]);
  const [inStock, setInStock] = useState(false);
  const [brand, setBrand] = useState("");
  const [type, setType] = useState("");
  const [condition, setCondition] = useState("");
  const [year, setYear] = useState("");
  const [driveType, setDriveType] = useState("");
  const [transmission, setTransmission] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [turbo, setTurbo] = useState("");
  const [torque, setTorque] = useState("");
  const [horsePower, setHorsePower] = useState("");
  const [gears, setGears] = useState("");
  const [maxSpeed, setMaxSpeed] = useState("");
  const [acceleration, setAcceleration] = useState("");
  const [powerKw, setPowerKw] = useState("");
  const [powerPs, setPowerPs] = useState("");
  const [batteryRange, setBatteryRange] = useState("");
  const [batteryCharge, setBatteryCharge] = useState("");
  const [engineSize, setEngineSize] = useState("");
  const [cylinders, setCylinders] = useState("");
  const [color, setColor] = useState("");
  const [doors, setDoors] = useState("");
  const [vin, setVin] = useState("");
  const [price, setPrice] = useState("");
  const [files, setFiles] = useState([]);
  const [generatedId, setGeneratedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [selectedSafetyFeatures, setSelectedSafetyFeatures] = useState([]);
  const [step, setStep] = useState(1);
  const imageUploadRef = useRef(null);

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/carbrand");
        if (!response.ok) {
          throw new Error("Failed to fetch brands");
        }
        const data = await response.json();
        setBrands(data.carBrand);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);

  const handleBrandChange = (e) => {
    const selectedBrand = e.target.value;
    setBrand(selectedBrand);
    const selectedBrandData = brands.find((b) => b.name === selectedBrand);
    if (selectedBrandData) {
      setModels(selectedBrandData.models);
      setBrand(selectedBrandData.name);
    } else {
      setModels([]);
      setBrand("");
    }
  };

  const handleFileChange = (e, fileType) => {
    try {
      const selectedFiles = e.target.files;
      const newFiles = Array.from(selectedFiles).map((file) => ({
        file,
        folderId: generatedId, // Use the same folder ID for all files
        fileName: `${fileType}_${file.name}`, // Prepend file type to file name
        fileType: fileType, // Store file type for reference
      }));
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    } catch (error) {
      console.error("Error handling file change:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      if (!brand) {
        throw new Error("Brand is required");
      }

      if (files.length === 0) {
        throw new Error("At least one image is required");
      }

      // Generate a unique folder ID
      const newGeneratedId = generateUniqueId();

      const uploadedFileUrls = await Promise.all(
        files.map(async (fileData) => {
          const folderName = determineFolderName(fileData.fileName);
          const uploadTaskSnapshot = await uploadFileToStorage(
            fileData.file,
            newGeneratedId, // Pass the newGeneratedId as folderId
            folderName // Pass the determined folderName when uploading
          );
          return getDownloadURL(uploadTaskSnapshot.ref);
        })
      );

      const formData = {
        listingTitle,
        brand,
        model,
        inStock,
        type,
        condition,
        year,
        driveType,
        transmission,
        fuelType,
        turbo,
        maxSpeed,
        acceleration,
        torque,
        horsePower,
        gears,
        powerKw,
        powerPs,
        batteryRange,
        batteryCharge,
        engineSize,
        cylinders,
        color,
        doors,
        vin,
        interiorImages: [],
        exteriorImages: [],
        cardImages: [],
        videos: [],
        audio: [],
        folderId: newGeneratedId, // Include folderId in formData
        price,
        features: selectedFeatures,
        safetyFeatures: selectedSafetyFeatures,
      };
      uploadedFileUrls.forEach((fileUrl) => {
        if (fileUrl.includes("video")) {
          formData.videos.push(fileUrl);
        } else if (fileUrl.includes("audio")) {
          formData.audio.push(fileUrl);
        } else if (fileUrl.includes("interior")) {
          formData.interiorImages.push(fileUrl);
        } else if (fileUrl.includes("exterior")) {
          formData.exteriorImages.push(fileUrl);
        } else if (fileUrl.includes("card")) {
          formData.cardImages.push(fileUrl);
        }
      });

      await saveFormDataToMongoDB(formData);
      console.log("formData:", formData);

      // Clear form fields and state after submission
      setBrand("");
      setModel("");
      setType("");
      setCondition("");
      setDriveType("");
      setTransmission("");
      setFuelType("");
      setTurbo("");
      setTorque("");
      setHorsePower("");
      setGears("");
      setPowerKw("");
      setPowerPs("");
      setBatteryRange("");
      setBatteryCharge("");
      setAcceleration("");
      setMaxSpeed("");
      setEngineSize("");
      setYear("");
      setCylinders("");
      setColor("");
      setDoors("");
      setInStock(false);
      setVin("");
      setPrice("");
      setFiles([]);
      setSelectedFeatures([]);
      setSelectedSafetyFeatures([]);
      setMessage("Data saved successfully.");
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setMessage(error.message || "An error occurred while saving data.");
      setLoading(false);
    }
  };

  const uploadFileToStorage = async (file, folderId, folderName) => {
    try {
      let storagePath = `images/${folderId}/${folderName}/`;
      const storageRef = ref(storage, storagePath + file.name);
      const uploadTaskSnapshot = await uploadBytesResumable(storageRef, file);
      console.log("File uploaded successfully:", uploadTaskSnapshot);
      return uploadTaskSnapshot;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const saveFormDataToMongoDB = async (formData) => {
    try {
      const response = await fetch("http://localhost:3000/api/carmodels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save data to MongoDB");
      }

      return response.json();
    } catch (error) {
      console.error("Error saving form data:", error);
      throw error;
    }
  };

  const determineFolderName = (fileName) => {
    if (fileName.includes("interior")) {
      return "interior";
    } else if (fileName.includes("exterior")) {
      return "exterior";
    } else if (fileName.includes("card")) {
      return "card";
    } else if (fileName.includes("video")) {
      return "video";
    } else if (fileName.includes("audio")) {
      return "audio";
    }
    // Add more conditions if needed for other types of files
  };

  return (
    <div className="p-8 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Add New Car Model
      </h1>
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <>
            {/* Listing Title */}
            <div className="flex items-center gap-5">
              <div className="mb-4 w-full">
                <label
                  htmlFor="listingTitle"
                  className="block text-sm font-medium text-gray-700"
                >
                  Listing Title:
                </label>
                <input
                  type="text"
                  id="listingTitle"
                  value={listingTitle}
                  onChange={(e) => setListingTitle(e.target.value)}
                  className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                />
              </div>
              {/* Brand */}
              <div className="mb-4 w-full">
                <label
                  htmlFor="brand"
                  className="block text-sm font-medium text-gray-700"
                >
                  Brand:
                </label>
                <select
                  id="brand"
                  value={brand}
                  onChange={handleBrandChange}
                  className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                >
                  <option value="">Select Brand</option>
                  {brands.map((brandOption, index) => (
                    <option key={index} value={brandOption.id}>
                      {brandOption.name}
                    </option> // Use brand ID as value
                  ))}
                </select>
              </div>
              {/* Model */}
              <div className="mb-4 w-full">
                <label
                  htmlFor="model"
                  className="block text-sm font-medium text-gray-700"
                >
                  Model:
                </label>
                <select
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                >
                  <option value="">Select Model</option>
                  {models.map((modelOption, index) => (
                    <option key={index} value={modelOption}>
                      {modelOption}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* In Stock */}
            <div className="mb-4">
              <div className="flex items-center p-1 ps-4 border border-gray-200 rounded dark:border-gray-700">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300  dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="inStock"
                  className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  In Stock
                </label>
              </div>
            </div>
            {/* Type */}
            <div className="mb-4">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                Type
              </h3>
              <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                {options.types.map((typeOption, index) => (
                  <li
                    key={index}
                    className="w-full p-2 border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
                  >
                    <div className="flex items-center ps-3">
                      <input
                        id={`typeOption_${index}`}
                        type="radio"
                        value={typeOption}
                        checked={type === typeOption}
                        onChange={(e) => setType(e.target.value)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300  dark:bg-gray-600 dark:border-gray-500"
                      />
                      <label
                        htmlFor={`typeOption_${index}`}
                        className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {typeOption}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* Condition */}
            <div className="mb-4">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                Condition
              </h3>
              <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                {options.conditions.map((conditionOption, index) => (
                  <li
                    key={index}
                    className="w-full border-b p-2 border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
                  >
                    <div className="flex items-center ps-3">
                      <input
                        id={`conditionOption_${index}`}
                        type="radio"
                        value={conditionOption}
                        checked={condition === conditionOption}
                        onChange={(e) => setCondition(e.target.value)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300  dark:bg-gray-600 dark:border-gray-500"
                      />
                      <label
                        htmlFor={`conditionOption_${index}`}
                        className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {conditionOption}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* VIN */}
            <div className="mb-4">
              <label
                htmlFor="VIN"
                className="mb-4 font-semibold text-gray-900 dark:text-white"
              >
                VIN
              </label>
              <input
                type="text"
                id="VIN"
                value={vin}
                placeholder="e.g. WAUZZZ8P19A053104"
                onChange={(e) => setVin(e.target.value)}
                className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
            {/* Year */}
            <div className="mb-4">
              <label
                htmlFor="year"
                className="block text-sm font-medium text-gray-700"
              >
                Year:
              </label>
              <input
                type="text"
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2024"
                className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
            {/* Price */}
            <div className="mb-4">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price:
              </label>
              <input
                type="text"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="250 000 TND"
                className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
          </>
        )}
        {step === 2 && (
          <>
            {/* Drive Type */}
            <div className="mb-4">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                Drive Type
              </h3>
              <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                {options.driveTypes.map((driveTypeOption, index) => (
                  <li
                    key={index}
                    className="w-full p-1 border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
                  >
                    <div className="flex items-center ps-3">
                      <input
                        id={`driveTypeOption_${index}`}
                        type="radio"
                        value={driveTypeOption}
                        checked={driveType === driveTypeOption}
                        onChange={(e) => setDriveType(e.target.value)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      />
                      <label
                        htmlFor={`driveTypeOption_${index}`}
                        className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {driveTypeOption}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* Transmission */}
            <div className="mb-4">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                Transmission
              </h3>
              <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                {options.transmissions.map((transmissionOption, index) => (
                  <li
                    key={index}
                    className="w-full p-1 border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
                  >
                    <div className="flex items-center ps-3">
                      <input
                        id={`transmissionOption_${index}`}
                        type="radio"
                        value={transmissionOption}
                        checked={transmission === transmissionOption}
                        onChange={(e) => setTransmission(e.target.value)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      />
                      <label
                        htmlFor={`transmissionOption_${index}`}
                        className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {transmissionOption}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* Fuel Type */}
            <div className="mb-4">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                Fuel Type
              </h3>
              <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                {options.fuelTypes.map((fuelTypeOption, index) => (
                  <li
                    key={index}
                    className="w-full p-1 border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
                  >
                    <div className="flex items-center ps-3">
                      <input
                        id={`fuelTypeOption_${index}`}
                        type="radio"
                        value={fuelTypeOption}
                        checked={fuelType === fuelTypeOption}
                        onChange={(e) => setFuelType(e.target.value)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      />
                      <label
                        htmlFor={`fuelTypeOption_${index}`}
                        className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {fuelTypeOption}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* Engine Size */}
            <div className="mb-4">
              <label
                htmlFor="engineSize"
                className="mb-4 font-semibold text-gray-900 dark:text-white"
              >
                Engine Size:
              </label>
              <input
                type="text"
                id="engineSize"
                value={engineSize}
                onChange={(e) => setEngineSize(e.target.value)}
                placeholder="e.g. 2000 cc 500Nm@1600-4500rpm"
                className="mt-3 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
            {/* Cylinders */}
            <div className="mb-4">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                Cylinders
              </h3>
              <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                {options.cylinders.map((cylindersOption, index) => (
                  <li
                    key={index}
                    className="w-full p-1 border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
                  >
                    <div className="flex items-center ps-3">
                      <input
                        id={`cylindersOption_${index}`}
                        type="radio"
                        value={cylindersOption}
                        checked={cylinders === cylindersOption.toString()}
                        onChange={(e) => setCylinders(e.target.value)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      />
                      <label
                        htmlFor={`cylindersOption_${index}`}
                        className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {cylindersOption}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* Turbo */}
            <div className="mb-4">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                Turbo
              </h3>
              <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                {options.turbo.map((turboOptions, index) => (
                  <li
                    key={index}
                    className="w-full p-1 border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
                  >
                    <div className="flex items-center ps-3">
                      <input
                        id={`turboOptions_${index}`}
                        type="radio"
                        value={turboOptions}
                        checked={turbo === turboOptions.toString()}
                        onChange={(e) => setTurbo(e.target.value)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      />
                      <label
                        htmlFor={`turboOptions_${index}`}
                        className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {turboOptions}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* Gears */}
            <div className="mb-4">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                Gears
              </h3>
              <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                {options.gears.map((gearsOptions, index) => (
                  <li
                    key={index}
                    className="w-full p-1 border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
                  >
                    <div className="flex items-center ps-3">
                      <input
                        id={`gearsOptions_${index}`}
                        type="radio"
                        value={gearsOptions}
                        checked={gears === gearsOptions.toString()}
                        onChange={(e) => setGears(e.target.value)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      />
                      <label
                        htmlFor={`gearsOptions_${index}`}
                        className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {gearsOptions}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* Max Speed */}
            <div className="mb-4">
              <label
                htmlFor="maxSpeed"
                className="mb-4 font-semibold text-gray-900 dark:text-white"
              >
                Max Speed
              </label>
              <input
                type="text"
                id="maxSpeed"
                value={maxSpeed}
                onChange={(e) => setMaxSpeed(e.target.value)}
                className="mt-3 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                placeholder="e.g. 0"
              />
            </div>
            {/* Horse Power */}
            <div className="mb-4">
              <label
                htmlFor="horsePower"
                className="mb-4 font-semibold text-gray-900 dark:text-white"
              >
                Horse Power
              </label>
              <input
                type="text"
                id="horsePower"
                value={horsePower}
                onChange={(e) => setHorsePower(e.target.value)}
                className="mt-3 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                placeholder="e.g. 0"
              />
            </div>
            {/* Acceleration */}
            <div className="mb-4">
              <label
                htmlFor="acceleration"
                className="mb-4 font-semibold text-gray-900 dark:text-white"
              >
                Acceleration
              </label>
              <input
                type="text"
                id="acceleration"
                value={acceleration}
                onChange={(e) => setAcceleration(e.target.value)}
                className="mt-3 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                placeholder="e.g. 0"
              />
            </div>
            {/* Torque */}
            <div className="mb-4">
              <label
                htmlFor="torque"
                className="mb-4 font-semibold text-gray-900 dark:text-white"
              >
                Torque
              </label>
              <input
                type="text"
                id="torque"
                value={torque}
                onChange={(e) => setTorque(e.target.value)}
                className="mt-3 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                placeholder="e.g. 0"
              />
            </div>
            {/* kw Power */}
            <div className="mb-4">
              <label
                htmlFor="kw"
                className="mb-4 font-semibold text-gray-900 dark:text-white"
              >
                kW Power
              </label>
              <input
                type="text"
                id="kw"
                value={powerKw}
                onChange={(e) => setPowerKw(e.target.value)}
                className="mt-3 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                placeholder="e.g. 0"
              />
            </div>
            {/* ps power */}
            <div className="mb-4">
              <label
                htmlFor="ps"
                className="mb-4 font-semibold text-gray-900 dark:text-white"
              >
                PS Power
              </label>
              <input
                type="text"
                id="ps"
                value={powerPs}
                onChange={(e) => setPowerPs(e.target.value)}
                className="mt-3 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                placeholder="e.g. 0"
              />
            </div>
            {/* Battery Range */}
            <div className="mb-4">
              <label
                htmlFor="batteryRange"
                className="mb-4 font-semibold text-gray-900 dark:text-white"
              >
                Battery Range
              </label>
              <input
                type="text"
                id="batteryRange"
                value={batteryRange}
                onChange={(e) => setBatteryRange(e.target.value)}
                className="mt-3 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                placeholder="e.g. 0"
              />
            </div>
            {/* Battery Charge */}
            <div className="mb-4">
              <label
                htmlFor="batteryCharge"
                className="mb-4 font-semibold text-gray-900 dark:text-white"
              >
                PS Power
              </label>
              <input
                type="text"
                id="batteryCharge"
                value={batteryCharge}
                onChange={(e) => setBatteryCharge(e.target.value)}
                className="mt-3 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                placeholder="e.g. 0"
              />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            {/* Color */}
            <div className="mb-4">
              <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
                Color
              </h3>
              <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                {options.colors.map((colorOption, index) => (
                  <li
                    key={index}
                    className="w-full p-2 border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
                  >
                    <div className="flex items-center ps-3">
                      <input
                        id={`colorOption_${index}`}
                        type="radio"
                        value={colorOption}
                        checked={color === colorOption}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      />
                      <label
                        htmlFor={`colorOption_${index}`}
                        className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {colorOption}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Doors */}
            <div className="mb-4">
              <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
                Doors
              </h3>
              <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                {options.doors.map((doorsOption, index) => (
                  <li
                    key={index}
                    className="w-full p-2 border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
                  >
                    <div className="flex items-center ps-3">
                      <input
                        id={`doorsOption_${index}`}
                        type="radio"
                        value={doorsOption}
                        checked={doors === doorsOption.toString()}
                        onChange={(e) => setDoors(e.target.value)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      />
                      <label
                        htmlFor={`doorsOption_${index}`}
                        className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {doorsOption}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Features */}
            <div className="mb-4">
              <label className="mb-4 font-semibold text-gray-900 dark:text-white">
                Features:
              </label>
              <div className="flex flex-wrap">
                {options.features.map((featureOption, index) => (
                  <div
                    key={index}
                    className="mt-3 flex flex-wrap items-center ps-4 border border-gray-200 rounded dark:border-gray-700 mr-4 mb-2"
                  >
                    <input
                      type="checkbox"
                      value={featureOption}
                      checked={selectedFeatures.includes(featureOption)}
                      onChange={(e) => {
                        const updatedFeatures = [...selectedFeatures];
                        if (e.target.checked) {
                          updatedFeatures.push(featureOption);
                        } else {
                          const index = updatedFeatures.indexOf(featureOption);
                          if (index > -1) {
                            updatedFeatures.splice(index, 1);
                          }
                        }
                        setSelectedFeatures(updatedFeatures);
                      }}
                      id={`featureOption_${index}`}
                      className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor={`featureOption_${index}`}
                      className="py-4 px-3 text-center ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      {featureOption}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            {/* Safety Features */}
            <div className="mb-4">
              <label className="mb-4 font-semibold text-gray-900 dark:text-white">
                Safety Features:
              </label>
              <div className="mb-4 flex flex-wrap">
                {options.safetyFeatures.map((safetyFeatureOption, index) => (
                  <div
                    key={index}
                    className="mt-3 flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700 mr-4 mb-2"
                  >
                    <input
                      type="checkbox"
                      value={safetyFeatureOption}
                      checked={selectedSafetyFeatures.includes(
                        safetyFeatureOption
                      )}
                      onChange={(e) => {
                        const updatedSafetyFeatures = [
                          ...selectedSafetyFeatures,
                        ];
                        if (e.target.checked) {
                          updatedSafetyFeatures.push(safetyFeatureOption);
                        } else {
                          const index =
                            updatedSafetyFeatures.indexOf(safetyFeatureOption);
                          if (index > -1) {
                            updatedSafetyFeatures.splice(index, 1);
                          }
                        }
                        setSelectedSafetyFeatures(updatedSafetyFeatures);
                      }}
                      id={`safetyFeatureOption_${index}`}
                      className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor={`safetyFeatureOption_${index}`}
                      className="py-4 px-3 text-center ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      {safetyFeatureOption}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {step === 4 && (
          <>
            {/* Interior Images */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">
                Upload Interior Images
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "interior", "image")}
                accept="image/*"
                multiple
                className="block mb-2"
              />
            </div>

            {/* Cover Image */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">
                Upload Cover Image
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "cover", "image")}
                accept="image/*"
                className="block mb-2"
              />
            </div>

            {/* Exterior Images */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">
                Upload Exterior Images
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "exterior", "image")}
                accept="image/*"
                multiple
                className="block mb-2"
              />
            </div>

            {/* Card Images */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">
                Upload Card Images
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "card", "image")}
                accept="image/*"
                multiple
                className="block mb-4"
              />
            </div>

            {/* Upload Video */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">Upload Videos</label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "videos", "video")}
                accept="video/*"
                multiple
                className="block mb-4"
              />
            </div>
            {/* Upload 3D Model */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">Upload 3D Model</label>
              <input
                type="file"
                accept=".gltf"
                onChange={(e) => handleFileChange(e, "dModels", "gltf")}
                multiple
              />
            </div>
            {/* Upload 3D Model */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">
                Upload Engine Sound
              </label>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => handleFileChange(e, "audio", "audio")}
                multiple // If you want to allow selecting multiple files
              />
            </div>
          </>
        )}

        {/* Navigation buttons */}
        {step !== 1 && (
          <button
            type="button"
            onClick={handlePreviousStep}
            className="mt-4 mr-4  px-8 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-zinc hover:bg-zinc/[0.9] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
          >
            Previous
          </button>
        )}
        {step !== 4 && (
          <button
            type="button"
            onClick={handleNextStep}
            className="mt-3 px-8 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-zinc hover:bg-zinc/[0.9] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
          >
            Next
          </button>
        )}
        {step === 4 && (
          <>
            {!loading && files.length > 0 && (
              <button
                type="submit"
                className="mt-3 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-zinc hover:bg-zinc/[0.9] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
              >
                Save
              </button>
            )}
          </>
        )}
        {message && <Link href="/listings"></Link>}
      </form>
    </div>
  );
};

export default ModelForm;
