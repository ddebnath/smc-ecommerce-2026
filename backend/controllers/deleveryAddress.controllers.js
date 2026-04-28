import { DeleveryAddress } from "../models/deliveryAddress.models.js";

/**
 * ✅ GET: Fetch user addresses
 */
export const getUserAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    let data = await DeleveryAddress.findOne({ userId });

    // create empty address if not exists
    if (!data) {
      data = await DeleveryAddress.create({
        userId,
        addressList: [],
        selectedAddress: 0,
      });
    }

    return res.status(200).json({
      success: true,
      addresses: data.addressList,
      selectedAddress: data.selectedAddress,
    });
  } catch (error) {
    console.log("getUserAddresses error:", error);
    return res.status(500).json({ success: false });
  }
};

/**
 * ✅ POST: Add new address
 */
export const addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const newAddress = req.body;

    let data = await DeleveryAddress.findOne({ userId });

    if (!data) {
      data = await DeleveryAddress.create({
        userId,
        addressList: [newAddress],
        selectedAddress: 0,
      });
    } else {
      data.addressList.push(newAddress);

      // if first address → select it
      if (data.addressList.length === 1) {
        data.selectedAddress = 0;
      }

      await data.save();
    }

    return res.status(200).json({
      success: true,
      message: "Address added successfully",
    });
  } catch (error) {
    console.log("addAddress error:", error);
    return res.status(500).json({ success: false });
  }
};

/**
 * ✅ DELETE: Remove address by index
 */
export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { index } = req.params;

    const data = await DeleveryAddress.findOne({ userId });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "No address data found",
      });
    }

    if (index < 0 || index >= data.addressList.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid index",
      });
    }

    data.addressList.splice(index, 1);

    // ✅ maintain selected index
    if (data.addressList.length === 0) {
      data.selectedAddress = 0;
    } else if (data.selectedAddress == index) {
      data.selectedAddress = 0;
    } else if (data.selectedAddress > index) {
      data.selectedAddress -= 1;
    }

    await data.save();

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.log("deleteAddress error:", error);
    return res.status(500).json({ success: false });
  }
};

/**
 * ✅ PUT: Set selected address
 */
export const setSelectedAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { index } = req.body;

    const data = await DeleveryAddress.findOne({ userId });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "No address data found",
      });
    }

    if (index < 0 || index >= data.addressList.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid index",
      });
    }

    data.selectedAddress = index;
    await data.save();

    return res.status(200).json({
      success: true,
      message: "Selected address updated",
    });
  } catch (error) {
    console.log("setSelectedAddress error:", error);
    return res.status(500).json({ success: false });
  }
};
