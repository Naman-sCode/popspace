import React, { useCallback } from 'react';
import { Modal } from '@components/Modal/Modal';
import { ModalTitleBar } from '@components/Modal/ModalTitleBar';
import { ModalContentWrapper } from '@components/Modal/ModalContentWrapper';
import { Trans, useTranslation } from 'react-i18next';
import { useRoomModalStore } from '../roomControls/useRoomModalStore';
import * as Yup from 'yup';
import { Form, Formik, FormikHelpers } from 'formik';
import { FormikTextField } from '@components/fieldBindings/FormikTextField';
import { FormikSubmitButton } from '@components/fieldBindings/FormikSubmitButton';
import i18n from '@src/i18n';
import { FormikCheckboxField } from '@components/fieldBindings/FormikCheckboxField';
import { Links } from '@constants/Links';
import { Link } from '@components/Link/Link';
import { MAX_EMAIL_LENTH, MAX_NAME_LENGTH } from '@src/constants';
import { Spacing } from '@components/Spacing/Spacing';
import { Box } from '@material-ui/core';
import Api from '@utils/api';
import { ErrorCodes } from '@constants/ErrorCodes';

interface ISignUpModalProps {}

type SignupFormValues = {
  email: string;
  firstName: string;
  lastName: string;
  receiveMarketing: boolean;
};

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .max(MAX_NAME_LENGTH, i18n.t('modals.signup.firstName.maxSize', { maxNameLength: MAX_NAME_LENGTH }))
    .required(i18n.t('common.required')),
  lastName: Yup.string()
    .max(MAX_NAME_LENGTH, i18n.t('modals.signup.lastName.maxSize', { maxNameLength: MAX_NAME_LENGTH }))
    .required(i18n.t('common.required')),
  email: Yup.string()
    .trim()
    .max(MAX_EMAIL_LENTH, i18n.t('modals.signup.email.maxSize', { maxNameLength: MAX_EMAIL_LENTH }))
    .email(i18n.t('modals.signup.email.invalid'))
    .required(i18n.t('common.required')),
  tos: Yup.boolean().required(i18n.t('modals.signup.tos.invalid')),
});

export const SignUpModal: React.FC<ISignUpModalProps> = (props) => {
  const { t } = useTranslation();

  const isOpen = useRoomModalStore((modals) => modals.signUp);
  const closeModal = useRoomModalStore((modals) => modals.api.closeModal);
  const onClose = () => closeModal('signUp');

  const handleSubmit = useCallback(
    async ({ email, firstName, lastName, ...rest }: SignupFormValues, util: FormikHelpers<SignupFormValues> | null) => {
      try {
        const response = await Api.signup({
          email: email.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          ...rest,
        });
        if (!response.success) {
          if (response.errorCode === ErrorCodes.ALREADY_REGISTERED) {
            // pop up prefilled sign in modal?
            alert('already registered');
          }
        } else {
          // we have submitted sign up, close this modal and pop code confirm
        }
      } catch (err) {
        // throw error
      }
    },
    []
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth={'sm'}>
      <ModalTitleBar title={t('modals.signUp.title')} onClose={onClose} />
      <ModalContentWrapper>
        <Formik<SignupFormValues>
          onSubmit={handleSubmit}
          initialStatus={{ sent: false }}
          initialValues={{ email: '', firstName: '', lastName: '', receiveMarketing: false }}
          validateOnBlur={false}
          validationSchema={validationSchema}
        >
          {({ isValid, dirty }) => (
            <Form>
              <Box display="flex" flexDirection="column" mb={2}>
                <Spacing>
                  <FormikTextField
                    id="firstName"
                    name="firstName"
                    placeholder={t('modals.signUp.firstName.placeholder')}
                    margin="normal"
                    autoComplete="given-name"
                    autoFocus
                    maxLength={10}
                  />
                  <FormikTextField
                    id="lastName"
                    name="lastName"
                    placeholder={t('modals.signUp.lastName.placeholder')}
                    margin="normal"
                    autoComplete="family-name"
                    maxLength={50}
                  />
                </Spacing>
                <FormikTextField
                  id="email"
                  name="email"
                  placeholder={t(' modals.signUp.email.placeholder')}
                  margin="normal"
                  autoComplete="email"
                />
                <FormikCheckboxField
                  id="tos"
                  name="tos"
                  value="tos"
                  label={
                    <Trans i18nKey="modals.signUp.tos.label">
                      I agree to the <Link to={Links.TOS}>{t('header.tos')}</Link>
                    </Trans>
                  }
                />
                <FormikCheckboxField
                  id="receiveMarketing"
                  name="receiveMarketing"
                  value="receiveMarketing"
                  label={t('modals.signUp.newsletterOptIn.label')}
                />
              </Box>
              <FormikSubmitButton disabled={!(isValid && dirty)}>
                {t('modals.signUp.submitButtonText')}
              </FormikSubmitButton>
            </Form>
          )}
        </Formik>
      </ModalContentWrapper>
    </Modal>
  );
};
