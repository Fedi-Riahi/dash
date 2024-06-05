"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "@/lib/firebase";
import options from "@/data/options";
import Link from "next/link";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";

const generateUniqueId = () => {
  return Math.random().toString(36).substr(2, 9);
};

const EditModelForm = ({ modelData }) => {
  const [listingTitle, setListingTitle] = useState(modelData.listingTitle);
  const [brand, setBrand] = useState(modelData.brand);
  const [model, setModel] = useState(modelData.model);
  const [inStock, setInStock] = useState(modelData.inStock);
  const [type, setType] = useState(modelData.type);
  const [condition, setCondition] = useState(modelData.condition);
  const [year, setYear] = useState(modelData.year);
  const [driveType, setDriveType] = useState(modelData.driveType);
  const [transmission, setTransmission] = useState(modelData.transmission);
  const [fuelType, setFuelType] = useState(modelData.fuelType);
  const [maxSpeed, setMaxSpeed] = useState(modelData.maxSpeed);
  const [acceleration, setAcceleration] = useState(modelData.acceleration);
  const [turbo, setTurbo] = useState(modelData.turbo);
  const [torque, setTorque] = useState(modelData.torque);
  const [horsePower, setHorsePower] = useState(modelData.horsePower);
  const [gears, setGears] = useState(modelData.gears);
  const [powerKw, setPowerKw] = useState(modelData.powerKw);
  const [powerPs, setPowerPs] = useState(modelData.powerPs);
  const [batteryRange, setBatteryRange] = useState(modelData.batteryRange);
  const [batteryCharge, setBatteryCharge] = useState(modelData.batteryCharge);
  const [engineSize, setEngineSize] = useState(modelData.engineSize);
  const [cylinders, setCylinders] = useState(modelData.cylinders);
  const [color, setColor] = useState(modelData.color);
  const [doors, setDoors] = useState(modelData.doors);
  const [vin, setVin] = useState(modelData.vin);
  const [price, setPrice] = useState(modelData.price);
  const [interiorImages, setInteriorImages] = useState(
    modelData.interiorImages
  );
  const [exteriorImages, setExteriorImages] = useState(
    modelData.exteriorImages
  );
  const [cardImages, setCardImages] = useState(modelData.cardImages);
  const [videos, setVideos] = useState(modelData.videos);
  const [audio, setAudio] = useState(modelData.audio);
  const [coverImage, setCoverImage] = useState(modelData.coverImage);
  const [files, setFiles] = useState([]);
  const [generatedId, setGeneratedId] = useState(modelData.folderId);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1);
  const imageUploadRef = useRef(null);
  const [features, setFeatures] = useState(modelData.features || []);
  const [safetyFeatures, setSafetyFeatures] = useState(
    modelData.safetyFeatures || []
  );
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("api/carbrand");
        if (!response.ok) {
          throw new Error("Failed to fetch models");
        }
        const data = await response.json();
        if (data && data.carBrand && data.carBrand.length > 0) {
          const models = data.carBrand[0].models;
          setModels(models);
        }
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };
    fetchModels();
  }, []);

  const handleFileChange = async (e, folderName, fileType) => {
    try {
      const selectedFiles = e.target.files;
      const newFiles = Array.from(selectedFiles).map((file) => ({
        file,
        folderId: generatedId,
        fileName: `${folderName}_${file.name}`,
        folderName: folderName,
        fileType: fileType,
      }));
  
      if (fileType === "video" || fileType === "audio") {
        // Filter out video/audio files and store their URLs
        const mediaUrls = newFiles.map((file) =>
          URL.createObjectURL(file.file)
        );
        if (fileType === "video") {
          setVideos((prevVideos) => [...prevVideos, ...mediaUrls]);
        } else {
          setAudio((prevAudio) => [...prevAudio, ...mediaUrls]);
        }
      } else if (fileType === "image") {
        // Handle images
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      }
  
      // Upload new files to storage with the correct folder structure
      await Promise.all(newFiles.map(async (fileData) => {
        try {
          const storageRef = ref(
            storage,
            `images/${fileData.folderId}/${fileData.folderName}/${fileData.fileName}`
          );
          const uploadTaskSnapshot = await uploadBytesResumable(
            storageRef,
            fileData.file
          );
          console.log("File uploaded successfully:", uploadTaskSnapshot);
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }));
    } catch (error) {
      console.error("Error handling file change:", error);
    }
  };
  
  
  
  

  const handleDeleteImage = async (imageName, folderName) => {
    try {
      const imagePath = imageName;
      const storageRef = ref(
        storage,
        `images/${generatedId}/${folderName}/${imagePath}`
      );
      await deleteObject(storageRef);
       // Update the state based on the folderName
       if (folderName === "interior") {
        setInteriorImages(
          interiorImages.filter((image) => image !== imageName)
        );
      } else if (folderName === "exterior") {
        setExteriorImages(
          exteriorImages.filter((image) => image !== imageName)
        );
      } else if (folderName === "card") {
        setCardImages(cardImages.filter((image) => image !== imageName));
      } else if (folderName === "cover") {
        setCoverImage(coverImage.filter((image) => image !== imageName));
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleDeleteAudio = (audioUrl) => {
    setAudio((prevAudio) => prevAudio.filter((audio) => audio !== audioUrl));
  };

  const handleDeleteVideo = (videoUrl) => {
    setVideos((prevVideos) => prevVideos.filter((video) => video !== videoUrl));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!brand) {
        throw new Error("Brand is required");
      }

      const uploadedImageUrls = await Promise.all(
        files.map(async (fileData) => {
          const storageRef = ref(
            storage,
            `${fileData.folderName}/${fileData.fileName}`
          );
          const uploadTaskSnapshot = await uploadBytesResumable(
            storageRef,
            fileData.file
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
        maxSpeed,
        acceleration,
        turbo,
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
        interiorImages,
        exteriorImages,
        cardImages,
        coverImage,
        videos,
        audio,
        folderId: generatedId,
        price,
        features: features,
        safetyFeatures: safetyFeatures,
      };

      uploadedImageUrls.forEach((imageUrl) => {
        if (imageUrl.includes("interior")) {
          formData.interiorImages.push(imageUrl);
        } else if (imageUrl.includes("exterior")) {
          formData.exteriorImages.push(imageUrl);
        } else if (imageUrl.includes("card")) {
          formData.cardImages.push(imageUrl);
        } else if (imageUrl.includes("cover")) {
          formData.coverImage.push(imageUrl);
        }
      });

      await updateFormDataInMongoDB(formData);
      console.log("formData:", formData);

      setMessage("Data updated successfully.");
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setMessage(error.message || "An error occurred while updating data.");
      setLoading(false);
    }
  };


  const updateFormDataInMongoDB = async (formData) => {
    const response = await fetch(`api/carmodels/${modelData._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to update data in MongoDB");
    }

    return response.json();
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="p-8 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Edit Car Model
      </h1>
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <>
            <div className="flex items-center gap-2">
              {/* Listing Title */}
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
                <input
                  type="text"
                  id="brand"
                  value={brand}
                  readOnly
                  onChange={(e) => setBrand(e.target.value)}
                  className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 cursor-not-allowed muted"
                />
              </div>
              {/* Model */}
              <div className="mb-4 w-full">
                <label
                  htmlFor="model"
                  className="block text-sm font-medium text-gray-700"
                >
                  Model:
                </label>
              </div>
            </div>
            {/* In Stock */}
            <div className="mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="mr-2"
                />

                <label
                  htmlFor="inStock"
                  className="block text-sm font-medium text-gray-700"
                >
                  In Stock
                </label>
              </div>
            </div>
            {/* Type */}
            <div className="mb-4">
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700"
              >
                Type:
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              >
                {options.types.map((typeOption) => (
                  <option key={typeOption} value={typeOption}>
                    {typeOption}
                  </option>
                ))}
              </select>
            </div>
            {/* Condition */}
            <div className="mb-4">
              <label
                htmlFor="condition"
                className="block text-sm font-medium text-gray-700"
              >
                Condition:
              </label>
              <select
                id="condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              >
                {options.conditions.map((conditionOption) => (
                  <option key={conditionOption} value={conditionOption}>
                    {conditionOption}
                  </option>
                ))}
              </select>
            </div>
            {/* VIN */}
            <div className="mb-4">
              <label
                htmlFor="vin"
                className="block text-sm font-medium text-gray-700"
              >
                VIN:
              </label>
              <input
                type="text"
                id="vin"
                value={vin}
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
                type="number"
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
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
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            {/* Engine Size */}
            <div className="mb-4">
              <label
                htmlFor="engineSize"
                className="block text-sm font-medium text-gray-700"
              >
                Engine Size:
              </label>
              <input
                type="text"
                id="engineSize"
                value={engineSize}
                onChange={(e) => setEngineSize(e.target.value)}
                className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
            {/* Transmission */}
            <div className="mb-4">
              <label
                htmlFor="transmission"
                className="block text-sm font-medium text-gray-700"
              >
                Transmission:
              </label>
              <select
                id="transmission"
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              >
                {options.transmissions.map((transmissionOption) => (
                  <option key={transmissionOption} value={transmissionOption}>
                    {transmissionOption}
                  </option>
                ))}
              </select>
            </div>
            {/* Drive Type */}
            <div className="mb-4">
              <label
                htmlFor="driveType"
                className="block text-sm font-medium text-gray-700"
              >
                Drive Type:
              </label>
              <select
                id="type"
                value={driveType}
                onChange={(e) => SetdriveType(e.target.value)}
                className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              >
                {options.driveTypes.map((driveTypeOption) => (
                  <option key={driveTypeOption} value={driveTypeOption}>
                    {driveTypeOption}
                  </option>
                ))}
              </select>
            </div>
            {/* Fuel Type */}
            <div className="mb-4">
              <label
                htmlFor="fuelType"
                className="block text-sm font-medium text-gray-700"
              >
                Fuel Type
              </label>
              <select
                id="fuelType"
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              >
                {options.fuelTypes.map((fuelTypeOption) => (
                  <option key={fuelTypeOption} value={fuelTypeOption}>
                    {fuelTypeOption}
                  </option>
                ))}
              </select>
            </div>
            {/* Cylinders */}
            <div className="mb-4">
              <label
                htmlFor="cylinders"
                className="block text-sm font-medium text-gray-700"
              >
                Cylinders
              </label>
              <select
                id="cylinders"
                value={cylinders}
                onChange={(e) => setCylinders(e.target.value)}
                className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              >
                {options.cylinders.map((cylindersOption) => (
                  <option key={cylindersOption} value={cylindersOption}>
                    {cylindersOption}
                  </option>
                ))}
              </select>
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
              <label
                htmlFor="color"
                className="block text-sm font-medium text-gray-700"
              >
                Color:
              </label>
              <select
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              >
                {options.colors.map((colorOption) => (
                  <option key={colorOption} value={colorOption}>
                    {colorOption}
                  </option>
                ))}
              </select>
            </div>
            {/* Doors */}
            <div className="mb-4">
              <label
                htmlFor="doors"
                className="block text-sm font-medium text-gray-700"
              >
                Doors:
              </label>
              <select
                id="doors"
                value={doors}
                onChange={(e) => setDoors(e.target.value)}
                className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              >
                {options.doors.map((doorOption) => (
                  <option key={doorOption} value={doorOption}>
                    {doorOption}
                  </option>
                ))}
              </select>
            </div>

            {/* Features */}
            <div className="mb-4">
              <label
                htmlFor="features"
                className="block text-sm font-medium text-gray-700"
              >
                Features:
              </label>
              <div className="flex flex-wrap mt-2">
                {options.features.map((featureOption) => (
                  <div
                    key={featureOption}
                    className="flex items-center mr-4 mb-2"
                  >
                    <input
                      type="checkbox"
                      id={featureOption}
                      checked={features.includes(featureOption)}
                      onChange={(e) =>
                        setFeatures((prevFeatures) =>
                          e.target.checked
                            ? [...prevFeatures, featureOption]
                            : prevFeatures.filter(
                                (feature) => feature !== featureOption
                              )
                        )
                      }
                      className="mr-2"
                    />
                    <label htmlFor={featureOption}>{featureOption}</label>
                  </div>
                ))}
              </div>
            </div>
            {/* Safety Features */}
            <div className="mb-4">
              <label
                htmlFor="safetyFeatures"
                className="block text-sm font-medium text-gray-700"
              >
                Safety Features:
              </label>
              <div className="flex flex-wrap mt-2">
                {options.safetyFeatures.map((safetyFeatureOption) => (
                  <div
                    key={safetyFeatureOption}
                    className="flex items-center mr-4 mb-2"
                  >
                    <input
                      type="checkbox"
                      id={safetyFeatureOption}
                      checked={safetyFeatures.includes(safetyFeatureOption)}
                      onChange={(e) =>
                        setSafetyFeatures((prevSafetyFeatures) =>
                          e.target.checked
                            ? [...prevSafetyFeatures, safetyFeatureOption]
                            : prevSafetyFeatures.filter(
                                (safetyFeature) =>
                                  safetyFeature !== safetyFeatureOption
                              )
                        )
                      }
                      className="mr-2"
                    />
                    <label htmlFor={safetyFeatureOption}>
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
            <label htmlFor="interiorImages">Interior Images:</label>
            <input
              type="file"
              id="interiorImages"
              multiple
              onChange={(e) => handleFileChange(e, "interior", "image")}
            />
            {interiorImages.map((image, index) => (
              <div key={index}>
                <img src={image} alt={`Interior ${index}`} />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(image, "interior")}
                >
                  <XMarkIcon className="bg-gray-800 h-[20px] w-[20px]" />
                </button>
              </div>
            ))}
            <label htmlFor="coverImage">Cover Image:</label>
            <input
              type="file"
              id="coverImage"
              multiple
              onChange={(e) => handleFileChange(e, "cover", "image")}
            />
            {coverImage.map((image, index) => (
              <div key={index}>
                <img src={image} alt={`Cover ${index}`} />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(image, "cover")}
                >
                  <XMarkIcon className="bg-gray-800 h-[20px] w-[20px]" />
                </button>
              </div>
            ))}
            <label htmlFor="exteriorImages">Exterior Images:</label>
            <input
              type="file"
              id="exteriorImages"
              multiple
              onChange={(e) => handleFileChange(e, "exterior", "image")}
            />
            {exteriorImages.map((image, index) => (
              <div key={index}>
                <img src={image} alt={`Exterior ${index}`} />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(image, "exterior")}
                >
                  <XMarkIcon />
                </button>
              </div>
            ))}
            <label htmlFor="cardImages">Card Images:</label>
            <input
              type="file"
              id="cardImages"
              multiple
              onChange={(e) => handleFileChange(e, "card", "image")}
            />
            {cardImages.map((image, index) => (
              <div key={index}>
                <img src={image} alt={`Card ${index}`} />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(image, "card")}
                >
                  <XMarkIcon className="h-6 w-6 text-zinc" />
                </button>
              </div>
            ))}

            <div className="mb-4">
              <label className="block mb-2 font-medium">Upload Videos</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleFileChange(e, "videos", "video")}
                multiple
              />
              <label htmlFor="videos">Videos:</label>
              {videos.map((videoUrl, index) => (
                <div key={index}>
                  <video controls>
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video element.
                  </video>
                  <button
                    type="button"
                    onClick={() => handleDeleteVideo(videoUrl)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium">
                Upload Engine Sound
              </label>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => handleFileChange(e, "audio", "audio")}
                multiple
              />
              <label htmlFor="audio">Audio:</label>
              {audio.map((audioUrl, index) => (
                <div key={index}>
                  <audio controls>
                    <source src={audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                  <button
                    type="button"
                    onClick={() => handleDeleteAudio(audioUrl)}
                  >
                    Delete
                  </button>
                </div>
              ))}
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
            {/* Submit button */}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              {loading ? "Updating..." : "Update"}
            </button>

            {/* Upload progress */}
            {uploadProgress > 0 && (
              <div className="mt-4">
                <progress value={uploadProgress} max="100" />
              </div>
            )}
          </>
        )}
        {/* Error message */}
        {message && <div className="mt-4 text-red-600">{message}</div>}
      </form>
    </div>
  );
};

export default EditModelForm;
