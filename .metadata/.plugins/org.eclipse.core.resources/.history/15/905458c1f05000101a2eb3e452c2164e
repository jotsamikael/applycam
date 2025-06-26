package com.jotsamikael.applycam.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.jotsamikael.applycam.common.ContentStatus;
import com.jotsamikael.applycam.trainingCenter.TrainingCenter;
import com.jotsamikael.applycam.user.User;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Async /* Since email sending may take some time, we send the email asynchronosly*/
    public void sendEmail(String to,
                         String username,
                         EmailTemplateName emailTemplateName,
                         String confirmationUrl,
                         String activationCode,
                         String subject) throws MessagingException {

    String templateName;
    if(emailTemplateName == null){
        templateName = "confirm-email";
     } else{
        templateName = emailTemplateName.getName();
    }
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(
                mimeMessage,
                MimeMessageHelper.MULTIPART_MODE_MIXED,
                StandardCharsets.UTF_8.name()
        );
        Map<String, Object> properties = new HashMap<>();
        properties.put("username", username);
        properties.put("confirmationUrl", confirmationUrl);
        properties.put("activation_code", activationCode);

        Context context = new Context();
        context.setVariables(properties);

        helper.setFrom("jotsamikael@gmail.com");
        helper.setTo(to);
        helper.setSubject(subject);

        String template = templateEngine.process(templateName, context);

        helper.setText(template, true);

        mailSender.send(mimeMessage);
    }
    
    @Async
    public void sendExamAssignmentEmail(String to, String username, String examCenterName, String examDate) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(
                mimeMessage,
                MimeMessageHelper.MULTIPART_MODE_MIXED,
                StandardCharsets.UTF_8.name()
        );

        Map<String, Object> properties = new HashMap<>();
        properties.put("username", username);
        properties.put("examCenterName", examCenterName);
        properties.put("examDate", examDate);

        Context context = new Context();
        context.setVariables(properties);

        helper.setFrom("jotsamikael@gmail.com");
        helper.setTo(to);
        helper.setSubject("Votre candidature a été acceptée !");
        String content = templateEngine.process("exam-assigned", context);
        helper.setText(content, true);
        mailSender.send(mimeMessage);
    }
    
    public void sendTemplateEmail(String to, String fullName, String centerName, String templateName, String subject) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(
                mimeMessage,
                MimeMessageHelper.MULTIPART_MODE_MIXED,
                StandardCharsets.UTF_8.name()
        );

        Map<String, Object> properties = new HashMap<>();
        properties.put("fullName", fullName);
        properties.put("centerName", centerName);

        Context context = new Context();
        context.setVariables(properties);

        helper.setFrom("jotsamikael@gmail.com");
        helper.setTo(to);
        helper.setSubject(subject);

        String htmlContent = templateEngine.process(templateName, context);
        helper.setText(htmlContent, true);

        mailSender.send(mimeMessage);
    }

    public void sendRejectionEmail(User user, TrainingCenter trainingCenter, String comment) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(
                mimeMessage,
                MimeMessageHelper.MULTIPART_MODE_MIXED,
                StandardCharsets.UTF_8.name()
        );

        Map<String, Object> properties = new HashMap<>();
        properties.put("fullName", user.fullName());
        properties.put("centerName", trainingCenter.getFullName());
        properties.put("comment", comment);

        Context context = new Context();
        context.setVariables(properties);

        helper.setFrom("jotsamikael@gmail.com");
        helper.setTo(user.getEmail());
        helper.setSubject("Rejet de votre centre de formation");

        String htmlContent = templateEngine.process("trainingcenter-rejection", context);
        helper.setText(htmlContent, true);

        mailSender.send(mimeMessage);
    }
    
    public void sendWaitingForValidationEmail(User user, TrainingCenter trainingCenter) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(
                mimeMessage,
                MimeMessageHelper.MULTIPART_MODE_MIXED,
                StandardCharsets.UTF_8.name()
        );

        Map<String, Object> properties = new HashMap<>();
        properties.put("fullName", user.fullName());
        properties.put("centerName", trainingCenter.getFullName());

        Context context = new Context();
        context.setVariables(properties);

        helper.setFrom("jotsamikael@gmail.com");
        helper.setTo(user.getEmail());
        helper.setSubject("Votre demande est en cours de traitement");

        String html = templateEngine.process("trainingcenter-pending", context);
        helper.setText(html, true);

        mailSender.send(mimeMessage);
    }



    
    
}
