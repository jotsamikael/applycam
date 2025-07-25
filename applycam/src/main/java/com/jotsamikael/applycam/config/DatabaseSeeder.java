package com.jotsamikael.applycam.config;

import com.jotsamikael.applycam.user.*;
import com.jotsamikael.applycam.promoter.*;
import com.jotsamikael.applycam.staff.*;
import com.jotsamikael.applycam.role.*;
import com.jotsamikael.applycam.trainingCenter.*;
import com.jotsamikael.applycam.campus.*;
import com.jotsamikael.applycam.examCenter.*;
import com.jotsamikael.applycam.candidate.*;
import com.jotsamikael.applycam.application.*;
import com.jotsamikael.applycam.course.*;
import com.jotsamikael.applycam.speciality.*;
import com.jotsamikael.applycam.offersSpeciality.*;
import com.jotsamikael.applycam.hasSchooled.*;
import com.jotsamikael.applycam.session.*;
import com.jotsamikael.applycam.payment.*;
import com.jotsamikael.applycam.subject.*;
import com.jotsamikael.applycam.activitySector.*;
import com.jotsamikael.applycam.centerStatus.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

// @Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PromoterRepository promoterRepository;
    private final StaffRepository staffRepository;
    private final RoleRepository roleRepository;
    private final TokenRepository tokenRepository;
    private final TrainingCenterRepository trainingCenterRepository;
    private final CampusRepository campusRepository;
    private final ExamCenterRepository examCenterRepository;
    private final CandidateRepository candidateRepository;
    private final ApplicationRepository applicationRepository;
    private final CourseRepository courseRepository;
    private final SpecialityRepository specialityRepository;
    private final OffersSpecialityRepository offersSpecialityRepository;
    private final HasSchooledRepository hasSchooledRepository;
    private final SessionRepository sessionRepository;
    private final PaymentRepository paymentRepository;
    private final SubjectRepository subjectRepository;
    private final SectorRepository sectorRepository;
    private final TrainingCenterHistoryRepository trainingCenterHistoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        Random random = new Random();

        // 1. Roles
        List<String> roleNames = List.of("ADMIN", "PROMOTER", "STAFF", "USER", "CANDIDATE");
        List<Role> roles = new ArrayList<>();
        for (String roleName : roleNames) {
            if (!roleRepository.existsByName(roleName)) {
                Role role = Role.builder().name(roleName).build();
                roles.add(role);
            }
        }
        if (!roles.isEmpty()) {
            roleRepository.saveAll(roles);
        }
        // Now fetch all roles from DB for further use
        List<Role> allRoles = new ArrayList<>();
        for (String roleName : roleNames) {
            roleRepository.findByName(roleName).ifPresent(allRoles::add);
        }
        roles = allRoles;

        // 2. Users
        List<User> users = new ArrayList<>();
        for (int i = 1; i <= 20; i++) {
            String email = "user" + i + "@test.com";
            if (!userRepository.existsByEmail(email)) {
                String rawPassword = "password";
                System.out.println("User: " + "User" + i + " " + "Test" + i + " | Email: " + email + " | Password: " + rawPassword);
                User user = User.builder()
                        .firstname("User" + i)
                        .lastname("Test" + i)
                        .dateOfBirth(LocalDate.of(1990 + (i % 10), (i % 12) + 1, (i % 28) + 1))
                        .sex(i % 2 == 0 ? "M" : "F")
                        .email(email)
                        .phoneNumber("6900000" + i)
                        .nationalIdNumber("ID" + (1000 + i))
                        .password(passwordEncoder.encode(rawPassword))
                        .enabled(true)
                        .actived(true)
                        .archived(false)
                        .roles(List.of(roles.get(i % roles.size())))
                        .build();
                users.add(user);
            }
        }
        if (!users.isEmpty()) {
            userRepository.saveAll(users);
        }

        // 3. Promoters
        List<Promoter> promoters = new ArrayList<>();
        for (int i = 1; i <= 20; i++) {
            String email = "promoter" + i + "@test.com";
            if (!userRepository.existsByEmail(email)) {
                String rawPassword = "password";
                System.out.println("Promoter: " + "Promoter" + i + " " + "Lastname" + i + " | Email: " + email + " | Password: " + rawPassword);
                Promoter promoter = Promoter.builder()
                        .firstname("Promoter" + i)
                        .lastname("Lastname" + i)
                        .dateOfBirth(LocalDate.of(1980 + (i % 10), (i % 12) + 1, (i % 28) + 1))
                        .sex(i % 2 == 0 ? "M" : "F")
                        .email(email)
                        .phoneNumber("6990000" + i)
                        .nationalIdNumber("PID" + (2000 + i))
                        .password(passwordEncoder.encode(rawPassword))
                        .enabled(true)
                        .actived(true)
                        .archived(false)
                        .roles(List.of(roles.get(1)))
                        .PhotoUrl("/uploads/users/1002/photo" + i + ".png")
                        .build();
                promoters.add(promoter);
            }
        }
        if (!promoters.isEmpty()) {
            promoterRepository.saveAll(promoters);
        }

        // 4. Staff
        List<Staff> staffList = new ArrayList<>();
        for (int i = 1; i <= 20; i++) {
            String email = "staff" + i + "@test.com";
            if (!userRepository.existsByEmail(email)) {
                String rawPassword = "password";
                System.out.println("Staff: " + "Staff" + i + " " + "Lastname" + i + " | Email: " + email + " | Password: " + rawPassword);
                Staff staff = Staff.builder()
                        .firstname("Staff" + i)
                        .lastname("Lastname" + i)
                        .dateOfBirth(LocalDate.of(1985 + (i % 10), (i % 12) + 1, (i % 28) + 1))
                        .sex(i % 2 == 0 ? "M" : "F")
                        .email(email)
                        .phoneNumber("6880000" + i)
                        .nationalIdNumber("SID" + (3000 + i))
                        .password(passwordEncoder.encode(rawPassword))
                        .enabled(true)
                        .actived(true)
                        .archived(false)
                        .roles(List.of(roles.get(2)))
                        .build();
                staffList.add(staff);
            }
        }
        if (!staffList.isEmpty()) {
            staffRepository.saveAll(staffList);
        }

        // 5. Training Centers
        List<TrainingCenter> centers = new ArrayList<>();
        for (int i = 1; i <= 20; i++) {
            TrainingCenter.TrainingCenterBuilder builder = TrainingCenter.builder()
                    .fullName("Center " + i)
                    .acronym("C" + i)
                    .agreementNumber("AG" + (3000 + i))
                    .agreementFileUrl("/uploads/centers/agreement" + i + ".pdf")
                    .agreementStatus(null)
                    .startDateOfAgreement(LocalDate.of(2015, 1, 1))
                    .endDateOfAgreement(LocalDate.of(2025, 12, 31))
                    .isCenterPresentCandidateForCqp(i % 2 == 0)
                    .isCenterPresentCandidateForDqp(i % 2 != 0)
                    .centerType(i % 2 == 0 ? "Privé" : "Public")
                    .centerPhone("6770000" + i)
                    .centerEmail("center" + i + "@test.com")
                    .website("https://center" + i + ".com")
                    .city("Ville" + (i % 5 + 1))
                    .region("Region" + (i % 5 + 1))
                    .division("Division" + (i % 3 + 1))
                    .SignatureLetterUrl("/uploads/centers/signature" + i + ".pdf")
                    .LocalisationFileUrl("/uploads/centers/localisation" + i + ".pdf")
                    .InternalRegulationFileUrl("/uploads/centers/reglement" + i + ".pdf")
                    .centerAge(5 + i);
            if (!promoters.isEmpty()) {
                builder.promoter(promoters.get(i % promoters.size()));
            } else {
                builder.promoter(null);
            }
            centers.add(builder.build());
        }
        trainingCenterRepository.saveAll(centers);

        // 6. Campus
        List<Campus> campusList = new ArrayList<>();
        for (int i = 1; i <= 20; i++) {
            Campus campus = Campus.builder()
                    .name("Campus " + i)
                    .trainingCenter(centers.get(i % centers.size()))
                    .build();
            campusList.add(campus);
        }
        campusRepository.saveAll(campusList);

        // 7. Exam Centers
        List<ExamCenter> examCenters = new ArrayList<>();
        for (int i = 1; i <= 20; i++) {
            ExamCenter examCenter = ExamCenter.builder()
                    .name("ExamCenter " + i)
                    .region("Region" + (i % 5 + 1))
                    .division("Division" + (i % 3 + 1))
                    .capacity(100 + i)
                    .isActived(true)
                    .build();
            examCenters.add(examCenter);
        }
        examCenterRepository.saveAll(examCenters);

        // 8. Courses
        List<Course> courses = new ArrayList<>();
        for (int i = 1; i <= 20; i++) {
            Course course = Course.builder()
                    .name("Course " + i)
                    .code("CODE" + i)
                    .description("Description for course " + i)
                    .priceForCqp(10000.0 + i * 1000)
                    .build();
            courses.add(course);
        }
        courseRepository.saveAll(courses);

        // 9. Specialities
        List<Speciality> specialities = new ArrayList<>();
        for (int i = 1; i <= 20; i++) {
            Speciality speciality = Speciality.builder()
                    .name("Speciality " + i)
                    .code("SP" + i)
                    .description("Description for speciality " + i)
                    .examType(i % 2 == 0 ? "CQP" : "DQP")
                    .build();
            specialities.add(speciality);
        }
        specialityRepository.saveAll(specialities);

        // 10. OffersSpeciality
        List<OffersSpeciality> offersSpecialities = new ArrayList<>();
        for (int i = 0; i < 20; i++) {
            OffersSpeciality.OffersSpecialityBuilder builder = OffersSpeciality.builder();
            if (!specialities.isEmpty()) {
                builder.speciality(specialities.get(i % specialities.size()));
            } else {
                builder.speciality(null);
            }
            if (!centers.isEmpty()) {
                builder.trainingCenter(centers.get(i % centers.size()));
            } else {
                builder.trainingCenter(null);
            }
            offersSpecialities.add(builder.build());
        }
        offersSpecialityRepository.saveAll(offersSpecialities);

        // 11. Sessions
        List<Session> sessions = new ArrayList<>();
        for (int i = 1; i <= 20; i++) {
            Session session = Session.builder()
                    .examType(i % 2 == 0 ? "CQP" : "DQP")
                    .examDate(LocalDate.now().plusDays(i))
                    .sessionYear("202" + (i % 3 + 1))
                    .registrationStartDate(LocalDate.now())
                    .registrationEndDate(LocalDate.now().plusMonths(1))
                    .build();
            sessions.add(session);
        }
        sessionRepository.saveAll(sessions);

        // 12. Candidates
        List<Candidate> candidates = new ArrayList<>();
        for (int i = 1; i <= 20; i++) {
            String email = "candidate" + i + "@test.com";
            if (!userRepository.existsByEmail(email)) {
                String rawPassword = "password";
                System.out.println("Candidate: " + "Candidate" + i + " " + "Lastname" + i + " | Email: " + email + " | Password: " + rawPassword);
                Candidate candidate = Candidate.builder()
                        .firstname("Candidate" + i)
                        .lastname("Lastname" + i)
                        .dateOfBirth(LocalDate.of(1995 + (i % 10), (i % 12) + 1, (i % 28) + 1))
                        .sex(i % 2 == 0 ? "M" : "F")
                        .email(email)
                        .phoneNumber("6550000" + i)
                        .nationalIdNumber("CID" + (4000 + i))
                        .password(passwordEncoder.encode(rawPassword))
                        .enabled(true)
                        .actived(true)
                        .archived(false)
                        .roles(List.of(roles.get(4)))
                        .placeOfBirth("Ville" + (i % 5 + 1))
                        .motherFullName("Mère" + i)
                        .fatherFullName("Père" + i)
                        .motherProfession("ProfessionMère" + i)
                        .fatherProfession("ProfessionPère" + i)
                        .highestSchoolLevel("Bac+" + (i % 5))
                        .nationality("Camerounaise")
                        .regionOrigins("Region" + (i % 5 + 1))
                        .freeCandidate(i % 2 == 0)
                        .repeatCandidate(i % 3 == 0)
                        .townOfResidence("Ville" + (i % 5 + 1))
                        .language(i % 2 == 0 ? "Français" : "Anglais")
                        .departmentOfOrigin("Département" + (i % 10 + 1))
                        .matrimonialSituation(i % 2 == 0 ? "Célibataire" : "Marié")
                        .learningLanguage(i % 2 == 0 ? "Français" : "Anglais")
                        .formationMode(i % 2 == 0 ? "Présentiel" : "Distanciel")
                        .financialRessource("Parent")
                        .numberOfKid(i % 4)
                        .cvUrl("/uploads/users/1002/cv" + i + ".pdf")
                        .letterUrl("/uploads/users/1002/lettre" + i + ".pdf")
                        .financialJustificationUrl("/uploads/users/1002/justif" + i + ".pdf")
                        .stageCertificateUrl("/uploads/users/1002/stage" + i + ".pdf")
                        .oldApplyanceUrl("/uploads/users/1002/old" + i + ".pdf")
                        .profilePictureUrl("/uploads/users/1002/photo" + i + ".png")
                        .birthCertificateUrl("/uploads/users/1002/birth" + i + ".pdf")
                        .nationalIdCardUrl("/uploads/users/1002/cni" + i + ".pdf")
                        .highestDiplomatUrl("/uploads/users/1002/diplome" + i + ".pdf")
                        .contentStatus(com.jotsamikael.applycam.common.ContentStatus.VALIDATED)
                        .examCenter(examCenters.get(i % examCenters.size()))
                        .build();
                candidates.add(candidate);
            }
        }
        if (!candidates.isEmpty()) {
            candidateRepository.saveAll(candidates);
        }

        // 13. HasSchooled
        List<HasSchooled> hasSchooledList = new ArrayList<>();
        for (int i = 0; i < 20; i++) {
            HasSchooled.HasSchooledBuilder builder = HasSchooled.builder();
            if (!candidates.isEmpty()) {
                builder.candidate(candidates.get(i % candidates.size()));
            } else {
                builder.candidate(null);
            }
            if (!centers.isEmpty()) {
                builder.trainingCenter(centers.get(i % centers.size()));
            } else {
                builder.trainingCenter(null);
            }
            builder.startYear(LocalDate.of(2010 + (i % 10), 9, 1))
                   .endYear(LocalDate.of(2011 + (i % 10), 6, 30));
            hasSchooledList.add(builder.build());
        }
        hasSchooledRepository.saveAll(hasSchooledList);

        // 14. Applications
        List<Application> applications = new ArrayList<>();
        for (int i = 0; i < 20; i++) {
            Application.ApplicationBuilder builder = Application.builder();
            if (!candidates.isEmpty()) {
                builder.candidate(candidates.get(i % candidates.size()));
            } else {
                builder.candidate(null);
            }
            if (!specialities.isEmpty()) {
                builder.speciality(specialities.get(i % specialities.size()));
            } else {
                builder.speciality(null);
            }
            if (!sessions.isEmpty()) {
                builder.session(sessions.get(i % sessions.size()));
            } else {
                builder.session(null);
            }
            builder.applicationYear("202" + (i % 3 + 1))
                   .applicationRegion("Region" + (i % 5 + 1))
                   .status(com.jotsamikael.applycam.common.ContentStatus.PAID);
            applications.add(builder.build());
        }
        applicationRepository.saveAll(applications);

        // 15. Payments
        List<Payment> payments = new ArrayList<>();
        for (int i = 0; i < 20; i++) {
            Payment payment = Payment.builder()
                    .amount(10000.0 + i * 1000)
                    .paymentMethod("CASH")
                    .secretCode(100000L + i)
                    .build();
            payments.add(payment);
        }
        paymentRepository.saveAll(payments);

        // 16. Subjects
        List<Subject> subjects = new ArrayList<>();
        for (int i = 1; i <= 20; i++) {
            Subject subject = Subject.builder()
                    .name("Subject " + i)
                    .build();
            subjects.add(subject);
        }
        subjectRepository.saveAll(subjects);

        // 17. Activity Sectors
        List<ActivitySector> sectors = new ArrayList<>();
        for (int i = 1; i <= 20; i++) {
            ActivitySector sector = ActivitySector.builder()
                    .name("Sector " + i)
                    .build();
            sectors.add(sector);
        }
        sectorRepository.saveAll(sectors);

        // 18. Center Status History
        List<TrainingCenterStatusHistory> statusHistories = new ArrayList<>();
        for (int i = 0; i < 20; i++) {
            TrainingCenterStatusHistory.TrainingCenterStatusHistoryBuilder builder = TrainingCenterStatusHistory.builder();
            if (!centers.isEmpty()) {
                builder.trainingCenter(centers.get(i % centers.size()));
            } else {
                builder.trainingCenter(null);
            }
            builder.status(com.jotsamikael.applycam.common.ContentStatus.APPROVED)
                   .comment("Historique validé " + i);
            statusHistories.add(builder.build());
        }
        trainingCenterHistoryRepository.saveAll(statusHistories);

        // 19. Tokens (exemple simple)
        List<Token> tokens = new ArrayList<>();
        for (int i = 1; i <= 20; i++) {
            Token.TokenBuilder builder = Token.builder().token("token" + i);
            if (!users.isEmpty()) {
                builder.user(users.get(i % users.size()));
            } else {
                builder.user(null);
            }
            tokens.add(builder.build());
        }
        tokenRepository.saveAll(tokens);
    }
} 