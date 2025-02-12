const Menu = require("../models/Menu");

const addMenuItem = async (req, res) => {
  try {
    const { name, description, category, price, status, dietary, image } =
      req.body;

    if (!name || !description || !category || !price || !image) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const newMenuItem = new Menu({
      name,
      description,
      category,
      price: Number(price),
      status: status || "available",
      dietary: dietary || [],
      image,
    });

    const savedMenuItem = await newMenuItem.save();

    res.status(201).json({
      success: true,
      message: "Menu item added successfully",
      data: savedMenuItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding menu item",
      error: error.message,
    });
  }
};

const getMenuItems = async (req, res) => {
  try {
    const menuItems = await Menu.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching menu items",
      error: error.message,
    });
  }
};

const getMenuItem = async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.status(200).json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching menu item",
      error: error.message,
    });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { name, description, category, price, status, dietary, image } =
      req.body;

    const updatedMenuItem = await Menu.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        category,
        price: Number(price),
        status,
        dietary: dietary || [],
        image,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedMenuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      data: updatedMenuItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating menu item",
      error: error.message,
    });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await Menu.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting menu item",
      error: error.message,
    });
  }
};

const updateMenuItemStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["available", "unavailable", "sold_out"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const menuItem = await Menu.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Menu item status updated successfully",
      data: menuItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating menu item status",
      error: error.message,
    });
  }
};

module.exports = {
  addMenuItem,
  getMenuItems,
  getMenuItem,
  updateMenuItem,
  deleteMenuItem,
  updateMenuItemStatus,
};
