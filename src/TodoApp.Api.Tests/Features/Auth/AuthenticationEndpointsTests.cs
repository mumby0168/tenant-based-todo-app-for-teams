using System.Net;
using FluentAssertions;
using TodoApp.Api.Data.Models;
using TodoApp.Api.Features.Auth.DTOs;
using TodoApp.Api.Tests.Common;
using TodoApp.Api.Tests.Features.Auth.Builders;

namespace TodoApp.Api.Tests.Features.Auth;

public class AuthenticationEndpointsTests(IntegrationTestFactory factory) : IntegrationTestBase(factory)
{
    private readonly AuthTestDataBuilder _testData = new();

    public class RequestCodeTests : AuthenticationEndpointsTests
    {
        public RequestCodeTests(IntegrationTestFactory factory) : base(factory) { }

        [Fact]
        public async Task ForNewUser_ShouldSendVerificationEmail()
        {
            // Arrange
            var email = _testData.GenerateEmail();

            // Act
            var response = await PostAsync<RequestCodeResponse>(
                AuthTestConstants.RequestCodeEndpoint,
                new { email });

            // Assert
            response.Should().HaveSuccessStatusCode();
            response.Should().HaveContent();
            response.Content!.Message.Should().Be(AuthTestConstants.VerificationCodeSentMessage);

            // Verify email was sent
            var sentEmail = MockEmailService.GetLastEmailFor(email);
            sentEmail.Should().BeVerificationCodeEmail(email);
            sentEmail.Should().HaveValidVerificationCode();

            // Verify token was stored in database
            await this.AssertVerificationTokenExists(email);
        }

        [Fact]
        public async Task ForExistingUser_ShouldSendVerificationEmail()
        {
            // Arrange
            var authResponse = await RegisterNewUserAsync();
            var email = authResponse.User.Email;

            // Act
            var response = await PostAsync<RequestCodeResponse>(
                AuthTestConstants.RequestCodeEndpoint,
                new { email });

            // Assert
            response.Should().HaveSuccessStatusCode();

            // Verify email was sent
            var sentEmails = MockEmailService.GetEmailsFor(email).ToList();
            sentEmails.Should().HaveCount(AuthTestConstants.ExistingUserEmailCount);
            var lastEmail = sentEmails.Last();
            lastEmail.Should().BeVerificationCodeEmail(email);
        }

        [Fact]
        public async Task WithInvalidEmail_ShouldReturnBadRequest()
        {
            // Act
            var response = await PostAsync<RequestCodeResponse>(
                AuthTestConstants.RequestCodeEndpoint,
                new { email = AuthTestConstants.InvalidEmail });

            // Assert
            response.Should().HaveStatusCode(HttpStatusCode.BadRequest);
            response.Error.Should().NotBeNull();

            // With FluentValidation, the error should be in the title or detail
            response.Error!.Title.Should().NotBeNullOrEmpty();
        }

        [Fact]
        public async Task ExceedingRateLimit_ShouldReturn429()
        {
            // Arrange
            var email = _testData.GenerateEmail();

            // Act - Send requests up to and beyond the limit
            await this.SendMultipleCodeRequests(email, AuthTestConstants.RateLimitMaxRequests);

            var rateLimitedResponse = await PostAsync<RequestCodeResponse>(
                AuthTestConstants.RequestCodeEndpoint,
                new { email });

            // Assert
            rateLimitedResponse.Should().HaveStatusCode(HttpStatusCode.TooManyRequests);
        }
    }

    public class VerifyCodeTests : AuthenticationEndpointsTests
    {
        public VerifyCodeTests(IntegrationTestFactory factory) : base(factory) { }

        [Fact]
        public async Task ForNewUser_ShouldIndicateNewUser()
        {
            // Arrange
            var email = _testData.GenerateEmail();
            var code = await this.RequestAndGetVerificationCode(email);

            // Act & Assert
            await this.VerifyCodeForNewUser(email, code);
        }

        [Fact]
        public async Task ForExistingUser_ShouldReturnAuthToken()
        {
            // Arrange
            var authResponse = await RegisterNewUserAsync();
            var email = authResponse.User.Email;
            var code = await this.RequestAndGetVerificationCode(email);

            // Act
            var response = await this.VerifyCodeForExistingUser(email, code);

            // Assert
            response.Content!.User!.Email.Should().Be(email);
        }

        [Fact]
        public async Task WithInvalidCode_ShouldReturnBadRequest()
        {
            // Arrange
            var email = _testData.GenerateEmail();
            await this.RequestAndGetVerificationCode(email);

            // Act
            var response = await PostAsync<VerifyCodeResponse>(
                AuthTestConstants.VerifyCodeEndpoint,
                new { email, code = AuthTestConstants.InvalidCode });

            // Assert
            response.Should().HaveStatusCode(HttpStatusCode.BadRequest);
            response.Should().HaveErrorDetail(AuthTestConstants.InvalidOrExpiredCodeError);
        }

        [Fact]
        public async Task WithExpiredCode_ShouldReturnBadRequest()
        {
            // Arrange
            var email = _testData.GenerateEmail();
            var code = await this.RequestAndGetVerificationCode(email);
            await this.ExpireVerificationToken(email);

            // Act
            var response = await PostAsync<VerifyCodeResponse>(
                AuthTestConstants.VerifyCodeEndpoint,
                new { email, code });

            // Assert
            response.Should().HaveStatusCode(HttpStatusCode.BadRequest);
            response.Should().HaveErrorDetail(AuthTestConstants.InvalidOrExpiredCodeError);
        }
    }

    public class CompleteRegistrationTests : AuthenticationEndpointsTests
    {
        public CompleteRegistrationTests(IntegrationTestFactory factory) : base(factory) { }

        [Fact]
        public async Task WithValidData_ShouldCreateUserAndTeam()
        {
            // Arrange
            var builder = new AuthRequestBuilder()
                .WithRandomEmail()
                .WithDisplayName(_testData.GenerateDisplayName())
                .WithTeamName(_testData.GenerateTeamName());

            var code = await this.RequestAndGetVerificationCode(builder.Email);
            await this.VerifyCodeForNewUser(builder.Email, code);

            // Act
            var response = await PostAsync<AuthResponse>(
                AuthTestConstants.CompleteRegistrationEndpoint,
                builder.WithCode(code).BuildCompleteRegistrationRequest());

            // Assert
            response.Should().HaveSuccessStatusCode();
            response.Should().HaveContent();

            var authResult = response.Content!;
            authResult.Should().BeValidForUser(
                builder.Email,
                builder.DisplayName,
                builder.TeamName);

            // Verify welcome email was sent
            var welcomeEmail = MockEmailService.GetWelcomeEmailFor(builder.Email);
            welcomeEmail.Should().BeWelcomeEmail(
                builder.Email,
                builder.DisplayName,
                builder.TeamName);

            // Verify database state
            await this.AssertUserWithTeamExists(
                builder.Email,
                builder.DisplayName,
                builder.TeamName);
        }

        [Fact]
        public async Task ForExistingUser_ShouldReturnBadRequest()
        {
            // Arrange
            var authResponse = await RegisterNewUserAsync();
            var email = authResponse.User.Email;
            var code = await this.RequestAndGetVerificationCode(email);
            await this.VerifyCodeForExistingUser(email, code);

            // Act
            var response = await PostAsync<AuthResponse>(
                AuthTestConstants.CompleteRegistrationEndpoint,
                new AuthRequestBuilder()
                    .WithEmail(email)
                    .WithCode(code)
                    .WithDisplayName(AuthTestConstants.NewUserName)
                    .WithTeamName(AuthTestConstants.NewTeamName)
                    .BuildCompleteRegistrationRequest());

            // Assert
            response.Should().HaveStatusCode(HttpStatusCode.BadRequest);
            response.Should().HaveErrorDetail(AuthTestConstants.AccountExistsError);
        }

        [Fact]
        public async Task WithoutVerifyingCode_ShouldReturnBadRequest()
        {
            // Arrange
            var builder = new AuthRequestBuilder()
                .WithRandomEmail()
                .WithCode(AuthTestConstants.TestCode)
                .WithDisplayName(AuthTestConstants.DefaultTestUserName)
                .WithTeamName(AuthTestConstants.DefaultTestTeamName);

            // Act - Try to complete registration without verifying code first
            var response = await PostAsync<AuthResponse>(
                AuthTestConstants.CompleteRegistrationEndpoint,
                builder.BuildCompleteRegistrationRequest());

            // Assert
            response.Should().HaveStatusCode(HttpStatusCode.BadRequest);
            response.Should().HaveErrorDetail(AuthTestConstants.InvalidOrExpiredCodeError);
        }
    }

    public class EndToEndFlowTests : AuthenticationEndpointsTests
    {
        public EndToEndFlowTests(IntegrationTestFactory factory) : base(factory) { }

        [Fact]
        public async Task NewUserRegistration_ShouldWork()
        {
            // This test demonstrates the complete flow from start to finish
            var authResponse = await RegisterNewUserAsync();

            // Use the token to access a protected endpoint
            var authenticatedClient = CreateAuthenticatedClient(authResponse);

            // Verify the auth response
            authResponse.Should().NotBeNull();
            authResponse.Token.Should().NotBeNullOrEmpty();
            authResponse.User.Should().NotBeNull();
            authResponse.Team.Should().NotBeNull();
            authResponse.Team.Role.Should().Be(AuthTestConstants.AdminRole);
        }

        [Fact]
        public async Task ExistingUserLogin_ShouldWork()
        {
            // First, register a new user
            var registrationAuth = await RegisterNewUserAsync();
            var email = registrationAuth.User.Email;

            // Now test logging in as that user
            var code = await this.RequestAndGetVerificationCode(email);
            var verifyResponse = await this.VerifyCodeForExistingUser(email, code);

            // Verify response
            verifyResponse.Content!.User!.Email.Should().Be(email);
            verifyResponse.Content.User.Id.Should().Be(registrationAuth.User.Id);
        }
    }
}