import { Request, Response } from 'express';
import { SupportTicket } from '../models/SupportTicket';
import { v4 as uuidv4 } from 'uuid';

export const createTicket = async (req: Request, res: Response) => {
  try {
    const ticketData = {
      ...req.body,
      ticketId: `RAN-${Math.floor(1000 + Math.random() * 9000)}`
    };
    const ticket = new SupportTicket(ticketData);
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ message: 'Failed to submit request' });
  }
};

export const adminReplyTicket = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reply } = req.body;
  try {
    const ticket = await SupportTicket.findByIdAndUpdate(
      id,
      { 
        adminReply: reply, 
        status: 'Resolved', 
        repliedAt: new Date() 
      },
      { new: true }
    );
    // Phase 6: Trigger Notification Service here (Email/WhatsApp)
    res.json(ticket);
  } catch (error) {
    res.status(400).json({ message: 'Update failed' });
  }
};

export const getTickets = async (req: Request, res: Response) => {
  const tickets = await SupportTicket.find().sort({ createdAt: -1 });
  res.json(tickets);
};