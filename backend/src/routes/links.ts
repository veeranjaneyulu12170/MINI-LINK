import { Router } from 'express';
import { auth, AuthRequest } from '../middleware/auth';
import Link from '../models/Link';
import { nanoid } from 'nanoid';

const router = Router();

// Get all links for user
router.get('/', auth, async (req: AuthRequest, res) => {
  try {
    const links = await Link.find({ userId: req.user.userId })
      .sort({ order: 1 });
    res.json(links);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch links' });
  }
});

// Create new link
router.post('/', auth, async (req: AuthRequest, res) => {
  console.log('Received link creation request:', req.body);
  
  try {
    const { title, url, icon, backgroundColor, textColor } = req.body;
    
    // Log the request body and user info
    console.log('Create link request body:', req.body);
    console.log('User from auth middleware:', req.user);
    
    // Validate required fields
    if (!title || !url) {
      return res.status(400).json({ error: 'Title and URL are required' });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }
    
    // Get highest order number
    const lastLink = await Link.findOne({ userId: req.user.userId })
      .sort({ order: -1 });
    const order = lastLink?.order != null ? lastLink.order + 1 : 0;
    
    // Generate a short code
    const shortCode = nanoid(8);
    
    const link = new Link({
      userId: req.user.userId,
      title,
      url,
      originalUrl: url,
      shortUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/l/${shortCode}`,
      shortCode,
      icon,
      backgroundColor,
      textColor,
      order,
      clicks: 0
    });
    
    const savedLink = await link.save();
    res.status(201).json(savedLink);
  } catch (error) {
    console.error('Error creating link:', error);
    res.status(500).json({ error: 'Failed to create link', details: error.message });
  }
});

// Update link
router.put('/:id', auth, async (req: AuthRequest, res) => {
  try {
    const { title, url, icon, backgroundColor, textColor, isActive, order } = req.body;
    
    const link = await Link.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { title, url, icon, backgroundColor, textColor, isActive, order },
      { new: true }
    );
    
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    res.json(link);
  } catch (err: any) {
    res.status(400).json({ error: 'Failed to update link' });
  }
});

// Delete link
router.delete('/:id', auth, async (req: AuthRequest, res) => {
  try {
    const link = await Link.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });
    
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    res.json({ message: 'Link deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete link' });
  }
});

// Reorder links
router.post('/reorder', auth, async (req: AuthRequest, res) => {
  try {
    const { linkIds } = req.body;
    
    if (!Array.isArray(linkIds)) {
      return res.status(400).json({ error: 'linkIds must be an array' });
    }

    for (let i = 0; i < linkIds.length; i++) {
      await Link.findOneAndUpdate(
        { _id: linkIds[i], userId: req.user.userId },
        { order: i }
      );
    }
    
    const links = await Link.find({ userId: req.user.userId })
      .sort({ order: 1 });
    res.json(links);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to reorder links' });
  }
});

// Increment click count and store click analytics for a link
router.post('/:id/clicks', async (req, res) => {
  try {
    const { id } = req.params;
    const { referrer, device, browser, location } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Invalid link ID' });
    }

    const link = await Link.findById(id);

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    // Initialize clickData array if it doesn't exist
    if (!link.clickData) {
      link.clickData = [];
    }

    // Add new click data
    link.clickData.push({
      timestamp: new Date().toISOString(),
      referrer: referrer || 'direct',
      device: device || 'unknown',
      browser: browser || 'unknown',
      location: location || 'unknown'
    });

    // Increment click count
    link.clicks = (link.clicks || 0) + 1;
    await link.save();

    res.json({ 
      message: 'Click data updated', 
      clicks: link.clicks,
      clickData: link.clickData 
    });
  } catch (error) {
    console.error('Error updating clicks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add this route to test links functionality
router.get('/test', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Links endpoint is accessible',
    routes: {
      getLinks: '/api/links',
      createLink: '/api/links',
      updateLink: '/api/links/:id',
      deleteLink: '/api/links/:id'
    }
  });
});

export default router; 