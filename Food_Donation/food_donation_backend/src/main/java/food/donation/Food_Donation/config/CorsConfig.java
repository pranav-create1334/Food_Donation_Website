package food.donation.Food_Donation.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(
                            "https://food-donation-website-ai8d7gyub-prs-projects-fa9db43c.vercel.app",
                            "https://food-donation-website-ai8d7gyub-prs-projects-fa9db43c-git-main-prs-projects.vercel.app",
                            "https://food-donation-website-ai8d7gyub-prs-projects-fa9db43c.vercel.app",
                            "https://food-donation-website-amqz.onrender.com",
                            "http://localhost:3000",
                            "http://localhost:5173",
                            "http://localhost:8080"
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD")
                        .allowedHeaders("*")
                        .exposedHeaders("Authorization", "Content-Type")
                        .allowCredentials(true)
                        .maxAge(3600);
            }
        };
    }
}