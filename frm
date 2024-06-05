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
            {/* Mileage */}
            <div className="mb-4">
              <label
                htmlFor="mileage"
                className="mb-4 font-semibold text-gray-900 dark:text-white"
              >
                Mileage:
              </label>
              <input
                type="text"
                id="mileage"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
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