package com.athletix.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    /**
     * Send simple text email
     */
    @Async
    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            message.setFrom("noreply@athletix.com");

            mailSender.send(message);
            log.info("Email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to: {}", to, e);
        }
    }
//    public void sendEmail(String to, String subject, String text) {
//        try {
//            SimpleMailMessage message = new SimpleMailMessage();
//            message.setTo(to);
//            message.setSubject(subject);
//            message.setText(text);
//            message.setFrom("noreply@athletix.com");
//            mailSender.send(message);
//        } catch (Exception e) {
//            System.err.println("Failed to send email: " + e.getMessage());
//            // Log error but don't throw - email failures shouldn't break the main flow
//        }
//    }

    /**
     * Send HTML email
     */
    @Async
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            helper.setFrom("noreply@athletix.com");

            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("Failed to send HTML email: " + e.getMessage());
        }
    }

    /**
     * Send OTP email with HTML template
     */
    @Async
    public void sendOTPEmail(String to, String name, String otp) {
        String subject = "Password Reset OTP - Athletix";
        String htmlContent = buildOTPEmailTemplate(name, otp);
        sendHtmlEmail(to, subject, htmlContent);
    }

    /**
     * Send booking confirmation email
     */
    @Async
    public void sendBookingConfirmationEmail(String to, String name, String venueName,
                                             String dateTime, Long bookingId) {
        String subject = "Booking Confirmed - Athletix";
        String htmlContent = buildBookingConfirmationTemplate(name, venueName, dateTime, bookingId);
        sendHtmlEmail(to, subject, htmlContent);
    }

    /**
     * Send payment receipt email
     */
    @Async
    public void sendPaymentReceiptEmail(String to, String name, double amount,
                                        Long bookingId, String transactionId) {
        String subject = "Payment Receipt - Athletix";
        String htmlContent = buildPaymentReceiptTemplate(name, amount, bookingId, transactionId);
        sendHtmlEmail(to, subject, htmlContent);
    }

    // HTML Email Templates

    private String buildOTPEmailTemplate(String name, String otp) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #2c5aa0 0%%, #1e3d6f 100%%); 
                             color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .otp-box { background: white; border: 2px solid #2c5aa0; padding: 20px; 
                              text-align: center; margin: 20px 0; border-radius: 8px; }
                    .otp { font-size: 32px; font-weight: bold; color: #2c5aa0; letter-spacing: 8px; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; 
                              margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🏆 Athletix</h1>
                        <p>Password Reset Request</p>
                    </div>
                    <div class="content">
                        <p>Hello %s,</p>
                        <p>You requested to reset your password. Use the OTP below to complete the process:</p>
                        
                        <div class="otp-box">
                            <p style="margin: 0; color: #666;">Your OTP Code</p>
                            <div class="otp">%s</div>
                            <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">
                                Valid for 10 minutes
                            </p>
                        </div>
                        
                        <div class="warning">
                            <strong>⚠️ Security Notice:</strong> Never share this OTP with anyone. 
                            Athletix will never ask for your OTP via phone or email.
                        </div>
                        
                        <p>If you didn't request this password reset, please ignore this email or 
                           contact our support team if you have concerns.</p>
                    </div>
                    <div class="footer">
                        <p>© 2024 Athletix. All rights reserved.</p>
                        <p>This is an automated email, please do not reply.</p>
                    </div>
                </div>
            </body>
            </html>
            """, name, otp);
    }

    private String buildBookingConfirmationTemplate(String name, String venueName,
                                                    String dateTime, Long bookingId) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #10b981 0%%, #059669 100%%); 
                             color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .booking-details { background: white; padding: 20px; border-radius: 8px; 
                                      margin: 20px 0; border: 1px solid #e5e7eb; }
                    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; 
                                 border-bottom: 1px solid #e5e7eb; }
                    .btn { display: inline-block; background: #2c5aa0; color: white; padding: 12px 30px; 
                          text-decoration: none; border-radius: 6px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>✅ Booking Confirmed!</h1>
                    </div>
                    <div class="content">
                        <p>Hi %s,</p>
                        <p>Great news! Your booking has been confirmed.</p>
                        
                        <div class="booking-details">
                            <h3 style="margin-top: 0;">Booking Details</h3>
                            <div class="detail-row">
                                <strong>Booking ID:</strong>
                                <span>#%d</span>
                            </div>
                            <div class="detail-row">
                                <strong>Venue:</strong>
                                <span>%s</span>
                            </div>
                            <div class="detail-row">
                                <strong>Date & Time:</strong>
                                <span>%s</span>
                            </div>
                        </div>
                        
                        <p>Please arrive 10 minutes before your booking time. 
                           Don't forget to bring a valid ID.</p>
                        
                        <a href="%s/bookings/%d" class="btn">View Booking Details</a>
                    </div>
                </div>
            </body>
            </html>
            """, name, bookingId, venueName, dateTime, frontendUrl, bookingId);
    }

    private String buildPaymentReceiptTemplate(String name, double amount,
                                               Long bookingId, String transactionId) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #6366f1 0%%, #4f46e5 100%%); 
                             color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .receipt { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                    .amount { font-size: 36px; color: #10b981; font-weight: bold; text-align: center; 
                             margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>💳 Payment Successful</h1>
                    </div>
                    <div class="content">
                        <p>Hi %s,</p>
                        <p>Your payment has been processed successfully!</p>
                        
                        <div class="receipt">
                            <h3>Payment Receipt</h3>
                            <div class="amount">Rs. %.2f</div>
                            <p><strong>Transaction ID:</strong> %s</p>
                            <p><strong>Booking ID:</strong> #%d</p>
                            <p><strong>Date:</strong> %s</p>
                        </div>
                        
                        <p>Thank you for your payment. You can view your booking details anytime 
                           in your account dashboard.</p>
                    </div>
                </div>
            </body>
            </html>
            """, name, amount, transactionId, bookingId,
                java.time.LocalDateTime.now().format(
                        java.time.format.DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' hh:mm a")
                ));
    }


}