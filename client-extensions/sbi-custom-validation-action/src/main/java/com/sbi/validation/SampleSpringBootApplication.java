package com.sbi.validation;

import com.liferay.client.extension.util.spring.boot3.ClientExtensionUtilSpringBootComponentScan;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

/**
 * @author Raymond Augé
 * @author Gregory Amerson
 * @author Brian Wing Shun Chan
 */
@Import(ClientExtensionUtilSpringBootComponentScan.class)
@SpringBootApplication
public class SampleSpringBootApplication {
	public static void main(String[] args) {
		SpringApplication.run(SampleSpringBootApplication.class, args);
	}
}